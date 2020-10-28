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
import { MusicDetails } from "../subEntities/MusicDetails";
import { RelatedPhrases } from "../entities/RelatedPhrases";

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
    let musicDet = new Music();
    Object.assign(musicDet, music);

    let uploadedBy = await this.userRepository.findById(music.uploadedById);
    if (!uploadedBy) throw new UserNotRetrieved(music.uploadedById);

    let categories = await this.categoryRepository.findByIds(music.categoryIds);
    if (!categories)
      throw new MyDbError("one or more of category ids' category not found");

    let relatedPhrases = await this.relatedPhrasesRepository.findByIds(
      music.relatedPhrasesIds
    );
    if (!relatedPhrases)
      throw new MyDbError(
        "one or more of related phrases ids' related phrase not found"
      );

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

  async all(): Promise<Music[]> {
    return this.find({
      where: { isVerified: true },
    });
  }

  async allUnverified(): Promise<Music[]> {
    return this.find({
      where: { isVerified: false },
    });
  }

  async findDetailsById(id: string): Promise<MusicDetails> {
    return this.findOne({
      where: { id: id },
      relations: ["categories", "relatedPhrases", "uploadedBy"],
    });
  }

  async findById(id: string): Promise<Music> {
    return this.findOne({
      where: { id: id },
    });
  }

  async findUploadsByUser(userId: string): Promise<Music[]> {
    return this.find({
      where: { uploadedBy: userId },
    });
  }

  async findByQueryAndCategoryIds(
    query: string,
    selectedCategoryIds: string[]
  ): Promise<Music[]> {
    if (selectedCategoryIds.length === 0) return this.findByQuery(query);
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
          .getQuery();
        return "relatedPhrases.groupId IN " + subQuery;
      })
      .andWhere("category.id IN (:...selectedCategoryIds)", {
        selectedCategoryIds,
      })
      .having("isVerified = true")
      .getMany();
  }

  async findByQuery(query: string): Promise<Music[]> {
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
          .getQuery();
        return "relatedPhrases.groupId IN " + subQuery;
      })
      .having("isVerified = true")
      .getMany();
  }

  async findByCategoryIds(categoryIds: string[]): Promise<Music[]> {
    if (categoryIds.length === 0) return this.all();

    return this.createQueryBuilder("music")
      .distinct(true)
      .leftJoin("music.categories", "category")
      .where("category.id IN (:...categoryIds)", {
        categoryIds,
      })
      .having("isVerified = true")
      .getMany();
  }

  async findByQueryAndExactCategoryIds(
    query: string,
    categoryIds: string[]
  ): Promise<Music[]> {
    if (categoryIds.length === 0) return this.findByQuery(query);

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
          .getQuery();
        return "relatedPhrases.groupId IN " + subQuery;
      })
      .andWhere("category.id IN (:...categoryIds)", {
        categoryIds,
      })
      .groupBy("music.id")
      .having("count(distinct categoryId) >= :length", {
        length: categoryIds.length,
      })
      .andHaving("isVerified = true")
      .getMany();
  }

  async findByExactCategoryIds(categoryIds: string[]): Promise<Music[]> {
    if (categoryIds.length === 0) return this.all();

    return this.createQueryBuilder("music")
      .distinct(true)
      .leftJoin("music.categories", "category")
      .where("category.id IN (:...categoryIds)", {
        categoryIds,
      })
      .groupBy("music.id")
      .having("count(distinct categoryId) >= :length", {
        length: categoryIds.length,
      })
      .andHaving("isVerified = true")
      .getMany();
  }

  // async findByQueryAndGroup(query: string): Promise<Music[]> {
  //   return this.createQueryBuilder("music")
  //     .distinct(true)
  //     .leftJoin("music.relatedPhrases", "relatedPhrases")
  //     .where((qb) => {
  //       const subQuery = qb
  //         .subQuery()
  //         .select("relatedPhrases.groupId")
  //         .from(RelatedPhrases, "relatedPhrases")
  //         .where("MATCH(phrase) AGAINST (:query IN BOOLEAN MODE)", {
  //           query: query.trim(),
  //         })
  //         .getQuery();
  //       return "relatedPhrases.groupId IN " + subQuery;
  //     })
  //     .having("isVerified = true")
  //     .orderBy("relatedPhrases.groupId")
  //     .getMany();
  // }

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
    musicDet.updatedBy = user;
    if (music.isVerified && !musicDet.isVerified) {
      musicDet.verifiedBy = user;
      musicDet.verifiedAt = new Date();
    }
    if (music.isVerified === false && musicDet.isVerified) {
      musicDet.verifiedAt = null;
      musicDet.verifiedBy = null;
    }
    Object.assign(musicDet, music);
    return this.save(musicDet);
  }

  async userDownloadedMusic(userId: string, musicId: string): Promise<boolean> {
    let userDet = await this.userRepository.findOne({
      where: { id: userId },
      relations: ["downloads"],
    });
    if (!userDet) throw new UserNotRetrieved(userId);

    let music = await this.findById(musicId);
    if (!music) throw new MusicNotRetrieved(musicId);

    userDet.downloads.push(music);
    music.numberOfDownloads += 1;

    return (await this.userRepository.save(userDet)) && (await this.save(music))
      ? true
      : false;
  }

  static isMusic(music: any): music is Music {
    return (
      typeof music === "object" &&
      typeof music.title === "string" &&
      typeof music.score === "string"
    );
  }
}
