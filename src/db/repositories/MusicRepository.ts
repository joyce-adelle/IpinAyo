import { Connection, EntityRepository, Repository } from "typeorm";
import { Music } from "../entities/Music";
import { CreateMusic } from "../inputInterfaces/CreateMusic";
import { UpdateMusic } from "../inputInterfaces/UpdateMusic";
import { UserRepository } from "./UserRepository";
import { UserRole } from "../../utilities/UserRoles";
import { CategoryRepository } from "./CategoryRepository";
import { RelatedPhrasesRepository } from "./RelatedPhrasesRepository";
import { InjectConnection } from "typeorm-typedi-extensions";
import { MusicNotRetrieved, UserNotRetrieved } from "../dbUtils/DbErrors";
import { MyDbError } from "../dbUtils/MyDbError";
import { RelatedPhrases } from "../entities/RelatedPhrases";
import { User } from "../entities/User";
import { Category } from "../entities/Category";

@EntityRepository(Music)
export class MusicRepository extends Repository<Music> {
  private readonly userRepository: UserRepository;
  private readonly categoryRepository: CategoryRepository;
  private readonly relatedPhrasesRepository: RelatedPhrasesRepository;

  constructor(
    @InjectConnection()
    private readonly connection: Connection
  ) {
    super();
    this.userRepository = this.connection.getCustomRepository(UserRepository);
    this.categoryRepository = this.connection.getCustomRepository(
      CategoryRepository
    );
    this.relatedPhrasesRepository = this.connection.getCustomRepository(
      RelatedPhrasesRepository
    );
  }

  async createAndSave(music: CreateMusic): Promise<Music> {
    let uploadedBy: User;
    let categories: Category[];
    let relatedPhrases: RelatedPhrases[];

    const u = this.userRepository.findById(music.uploadedById);
    const c = this.categoryRepository.findByIds(music.categoryIds);
    const r = this.relatedPhrasesRepository.findByIds(music.relatedPhrasesIds);

    let musicDet = new Music();
    Object.assign(musicDet, music);

    [uploadedBy, categories, relatedPhrases] = await Promise.all([u, c, r]);

    if (!uploadedBy) throw new UserNotRetrieved(music.uploadedById);
    if (categories.length === 0)
      throw new MyDbError("none of category ids' found");
    if (relatedPhrases.length === 0)
      throw new MyDbError("none of related phrases ids' found");

    musicDet.uploadedBy = uploadedBy;
    musicDet.updatedBy = uploadedBy;
    musicDet.categories = categories;
    musicDet.relatedPhrases = relatedPhrases;

    if (uploadedBy.role != UserRole.User) {
      musicDet.isVerified = true;
      musicDet.verifiedBy = uploadedBy;
      musicDet.verifiedAt = new Date();
    }

    return this.save(musicDet);
  }

  async all(take: number = 20, skip: number = 0): Promise<[Music[], number]> {
    return this.findAndCount({
      where: { isVerified: true },
      skip: skip,
      take: take,
    });
  }

  async allUnverified(): Promise<[Music[], number]> {
    return this.findAndCount({
      where: { isVerified: false },
      take: 20,
    });
  }

  async findDetailsById(id: string): Promise<Music> {
    return this.findOne({
      where: { id: id },
      relations: [
        "categories",
        "relatedPhrases",
        "uploadedBy",
        "updatedBy",
        "verifiedBy",
      ],
    });
  }

  async findById(id: string): Promise<Music> {
    return this.findOne({
      where: { id: id, isVerified: true },
    });
  }

  async findUploadsByUser(
    userId: string,
    take: number = 20,
    skip: number = 0
  ): Promise<[Music[], number]> {
    return this.findAndCount({
      where: { uploadedBy: userId, isVerified: true },
      skip: skip,
      take: take,
    });
  }

  async findDownloadsByUser(
    userId: string,
    take: number = 20,
    skip: number = 0
  ): Promise<[Music[], number]> {
    return this.createQueryBuilder("music")
      .leftJoin("music.downloadedBy", "user")
      .where("user.id = :userId", { userId: userId })
      .skip(skip)
      .take(take)
      .getManyAndCount();
  }

  async findByQueryAndCategoryIds(
    query: string,
    selectedCategoryIds: string[],
    take: number = 20,
    skip: number = 0
  ): Promise<[Music[], number]> {
    if (selectedCategoryIds.length === 0)
      return this.findByQuery(query, skip, take);
    return this.createQueryBuilder("music")
      .distinct(true)
      .leftJoin("music.categories", "category")
      .leftJoin("music.relatedPhrases", "relatedPhrases")
      .where(
        "MATCH(title, composers, arrangers, description) AGAINST (:query IN BOOLEAN MODE)",
        {
          query: query.trim(),
        }
      )
      .orWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select("relatedPhrases.groupId")
          .from(RelatedPhrases, "relatedPhrases")
          .where("MATCH(phrase) AGAINST (:query IN BOOLEAN MODE)", {
            query: query.trim(),
          })
          .orderBy("relatedPhrases.groupId")
          .getQuery();
        return "relatedPhrases.groupId IN " + subQuery;
      })
      .andWhere("category.id IN (:...selectedCategoryIds)", {
        selectedCategoryIds,
      })
      .andWhere("music.isVerified = true")
      .skip(skip)
      .take(take)
      .getManyAndCount();
  }

  async findByQuery(
    query: string,
    take: number = 20,
    skip: number = 0
  ): Promise<[Music[], number]> {
    if (!query) return this.all(skip, take);

    return this.createQueryBuilder("music")
      .distinct(true)
      .leftJoin("music.relatedPhrases", "relatedPhrases")
      .where(
        "MATCH(title, composers, arrangers, description) AGAINST (:query IN BOOLEAN MODE)",
        {
          query: query.trim(),
        }
      )
      .orWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select("relatedPhrases.groupId")
          .from(RelatedPhrases, "relatedPhrases")
          .where("MATCH(phrase) AGAINST (:query IN BOOLEAN MODE)", {
            query: query.trim(),
          })
          .orderBy("relatedPhrases.groupId")
          .getQuery();
        return "relatedPhrases.groupId IN " + subQuery;
      })
      .andWhere("music.isVerified = true")
      .skip(skip)
      .take(take)
      .getManyAndCount();
  }

  async findByCategoryIds(
    categoryIds: string[],
    take: number = 20,
    skip: number = 0
  ): Promise<[Music[], number]> {
    if (categoryIds.length === 0) return this.all(skip, take);

    return this.createQueryBuilder("music")
      .distinct(true)
      .leftJoin("music.categories", "category")
      .where("category.id IN (:...categoryIds)", {
        categoryIds,
      })
      .andWhere("music.isVerified = true")
      .skip(skip)
      .take(take)
      .getManyAndCount();
  }

  async findByQueryAndExactCategoryIds(
    query: string,
    categoryIds: string[],
    take: number = 20,
    skip: number = 0
  ): Promise<[Music[], number]> {
    if (categoryIds.length === 0) return this.findByQuery(query, skip, take);

    return this.createQueryBuilder("music")
      .distinct(true)
      .leftJoin("music.categories", "category")
      .leftJoin("music.relatedPhrases", "relatedPhrases")
      .where(
        "MATCH(title, composers, arrangers, description) AGAINST (:query IN BOOLEAN MODE)",
        {
          query: query.trim(),
        }
      )
      .orWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select("relatedPhrases.groupId")
          .from(RelatedPhrases, "relatedPhrases")
          .where("MATCH(phrase) AGAINST (:query IN BOOLEAN MODE)", {
            query: query.trim(),
          })
          .orderBy("relatedPhrases.groupId")
          .getQuery();
        return "relatedPhrases.groupId IN " + subQuery;
      })
      .andWhere("category.id IN (:...categoryIds)", {
        categoryIds,
      })
      .andWhere("music.isVerified = true")
      .groupBy("music.id")
      .having("count(distinct categoryId) >= :length", {
        length: categoryIds.length,
      })
      .skip(skip)
      .take(take)
      .getManyAndCount();
  }

  async findByExactCategoryIds(
    categoryIds: string[],
    take: number = 20,
    skip: number = 0
  ): Promise<[Music[], number]> {
    if (categoryIds.length === 0) return this.all(skip, take);

    return this.createQueryBuilder("music")
      .distinct(true)
      .leftJoin("music.categories", "category")
      .where("category.id IN (:...categoryIds)", {
        categoryIds,
      })
      .andWhere("isVerified = true")
      .groupBy("music.id")
      .having("count(distinct categoryId) >= :length", {
        length: categoryIds.length,
      })
      .skip(skip)
      .take(take)
      .getManyAndCount();
  }

  async updateMusic(
    id: string,
    updatedById: string,
    music: UpdateMusic
  ): Promise<Music> {
    let musicDet = await this.findById(id);
    if (!MusicRepository.isMusic(musicDet)) {
      throw new MusicNotRetrieved(id);
    }
    const user = await this.userRepository.findById(updatedById);
    if (!user) throw new UserNotRetrieved(updatedById);

    if (music.isVerified && !musicDet.isVerified) {
      musicDet.verifiedBy = user;
      musicDet.verifiedAt = new Date();
    }
    if (music.isVerified === false && musicDet.isVerified) {
      musicDet.verifiedAt = null;
      musicDet.verifiedBy = null;
    }

    if (music.addCategoryIds && music.removeCategoryIds)
      await this.createQueryBuilder()
        .relation("categories")
        .of(id)
        .addAndRemove(music.addCategoryIds, music.removeCategoryIds);
    if (music.addCategoryIds && !music.removeCategoryIds)
      await this.createQueryBuilder()
        .relation("categories")
        .of(id)
        .add(music.addCategoryIds);
    if (!music.addCategoryIds && music.removeCategoryIds)
      await this.createQueryBuilder()
        .relation("categories")
        .of(id)
        .remove(music.removeCategoryIds);

    if (music.addRelatedPhrasesIds && music.removeRelatedPhrasesIds)
      await this.createQueryBuilder()
        .relation("relatedPhrases")
        .of(id)
        .addAndRemove(
          music.addRelatedPhrasesIds,
          music.removeRelatedPhrasesIds
        );
    if (music.addRelatedPhrasesIds && !music.removeRelatedPhrasesIds)
      await this.createQueryBuilder()
        .relation("relatedPhrases")
        .of(id)
        .add(music.addRelatedPhrasesIds);
    if (!music.addRelatedPhrasesIds && music.removeRelatedPhrasesIds)
      await this.createQueryBuilder()
        .relation("relatedPhrases")
        .of(id)
        .remove(music.removeRelatedPhrasesIds);

    Object.assign(musicDet, music);
    musicDet.updatedBy = user;
    return this.save(musicDet);
  }

  static isMusic(music: any): music is Music {
    return (
      typeof music === "object" &&
      typeof music.title === "string" &&
      typeof music.score === "string"
    );
  }
}
