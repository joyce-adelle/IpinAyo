import { EntityRepository, Repository } from "typeorm";
import { Music } from "../entities/Music";
import { CreateMusic } from "../inputInterfaces/CreateMusic";
import { UpdateMusic } from "../inputInterfaces/UpdateMusic";
import { UserRepository } from "./UserRepository";
import { UserRole } from "../../utilities/UserRoles";
import { CategoryRepository } from "./CategoryRepository";
import { RelatedPhrasesRepository } from "./RelatedPhrasesRepository";
import { access } from "fs";
import { F_OK } from "constants";
import { InjectRepository } from "typeorm-typedi-extensions";
import { MusicNotRetrieved, UserNotRetrieved } from "../dbUtils/DbErrors";
import { MyDbError } from "../dbUtils/MyDbError";
import { MusicDetails } from "../subEntities/MusicDetails";
import { RelatedPhrases } from "../entities/RelatedPhrases";
import { Inject } from 'typedi';

@EntityRepository(Music)
export class MusicRepository extends Repository<Music> {
  @Inject()
  private readonly userRepository: UserRepository;

  @InjectRepository()
  private readonly categoryRepository: CategoryRepository;

  @InjectRepository()
  private readonly relatedPhrasesRepository: RelatedPhrasesRepository;

  async createAndSave(music: CreateMusic): Promise<Music> {
    let musicDet = new Music();
    Object.assign(musicDet, music);

    access(music.scorePath, F_OK, (err) => {
      if (err) {
        throw new MyDbError("Score not found");
      } else {
        musicDet.score = `${process.env.SCORE_URL}/${music.scoreFilename}`;
      }
    });

    let uploadedBy = await this.userRepository.findUserById(music.uploadedById);
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
    }
    if (music.audioPath) {
      access(music.audioPath, F_OK, (err) => {
        if (err) {
          musicDet.audio = null;
        } else {
          musicDet.audio = `${process.env.AUDIO_URL}/${music.audioFilename}`;
        }
      });
    }

    return this.save(musicDet);
  }

  async allMusic(): Promise<Music[]> {
    return this.find({
      where: { isVerified: true },
    });
  }

  async allUnverifiedMusic(): Promise<Music[]> {
    return this.find({
      where: { isVerified: false },
    });
  }

  async findMusicDetailsById(id: string): Promise<MusicDetails> {
    return this.findOne({
      where: { id: id },
      relations: ["categories", "relatedPhrases", "uploadedBy"],
    });
  }

  async findMusicById(id: string): Promise<Music> {
    return this.findOne({
      where: { id: id },
    });
  }

  async findRelatedMusicByQuery(query: string): Promise<Music[]>;
  async findRelatedMusicByQuery(
    query: string,
    selectedCategoryIds: string[]
  ): Promise<Music[]>;

  async findRelatedMusicByQuery(
    query: string,
    selectedCategoryIds?: string[]
  ): Promise<Music[]> {
    if (selectedCategoryIds) {
      if (selectedCategoryIds.length !== 0) {
        let allCats: string[] = [];
        await this.query(
          "SELECT distinct id_descendant as id FROM category_closure WHERE id_ancestor in (?)",
          [...selectedCategoryIds]
        ).then((RowDataPackets) => {
          allCats.push(...RowDataPackets.map((cat: { id: string }) => cat.id));
        });
        if (allCats.length === 0)
          throw new MyDbError("invalid category among selected categories");
        return this.createQueryBuilder("music")
          .distinct(true)
          .leftJoin("music.categories", "category")
          .where(
            "MATCH(title, composers, arrangers, description) AGAINST (:query IN BOOLEAN MODE)",
            {
              query: query.trim(),
            }
          )
          .andWhere("category.id IN (:...allCats)", {
            allCats,
          })
          .having("isVerified = true")
          .getMany();
      }
    }
    return this.createQueryBuilder("music")
      .distinct(true)
      .leftJoin("music.categories", "category")
      .where(
        "MATCH(title, composers, arrangers, description) AGAINST (:query IN BOOLEAN MODE)",
        {
          query: query.trim(),
        }
      )
      .having("isVerified = true")
      .getMany();
  }

  async findRelatedMusicByCategories(categories: string[]): Promise<Music[]> {
    if (categories.length === 0)
      return this.find({
        where: { isVerified: true },
      });

    let allCats: string[] = [];
    await this.query(
      "SELECT distinct id_descendant as id FROM category_closure WHERE id_ancestor in (?)",
      [...categories]
    ).then((RowDataPackets) => {
      allCats.push(...RowDataPackets.map((cat: { id: string }) => cat.id));
    });
    if (allCats.length === 0)
      throw new MyDbError("invalid category among selected categories");
    return this.createQueryBuilder("music")
      .distinct(true)
      .leftJoin("music.categories", "category")
      .where("category.id IN (:...allCats)", {
        allCats,
      })
      .having("isVerified = true")
      .printSql()
      .getMany();
  }

  async findRelatedMusicIdsByQuery(query: string): Promise<Music[]> {
    return this.createQueryBuilder("music")
      .leftJoin("music.relatedPhrases", "relatedPhrases")
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select("relatedPhrases.groupId")
          .from(RelatedPhrases, "relatedPhrases")
          .where("MATCH(phrase) AGAINST (:query IN BOOLEAN MODE)", {
            query: query.trim(),
          })
          .getQuery();
        return "groupId IN " + subQuery;
      })
      .having("isVerified = true")
      .orderBy("relatedPhrases.groupId")
      .getMany();
  }

  async updateMusic(id: string, music: UpdateMusic): Promise<Music> {
    let musicDet = await this.findMusicById(id);
    if (!MusicRepository.isMusic(musicDet)) {
      throw new MusicNotRetrieved(id);
    }
    Object.assign(musicDet, music);
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
