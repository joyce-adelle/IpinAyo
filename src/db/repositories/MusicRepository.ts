import { EntityRepository, Repository, getCustomRepository } from "typeorm";
import * as util from "util";
import { Music } from "../entities/Music";
import { CreateMusic } from "../inputInterfaces/CreateMusic";
import { UpdateMusic } from "../inputInterfaces/UpdateMusic";
import { UserRepository } from "./UserRepository";
import { UserRole } from "../../utilities/UserRoles";
import { CategoryRepository } from "./CategoryRepository";
import { RelatedPhrasesRepository } from "./RelatedPhrasesRepository";
import { access } from "fs";
import { F_OK } from "constants";

@EntityRepository(Music)
export class MusicRepository extends Repository<Music> {
  async createAndSave(music: CreateMusic): Promise<Music> {
    try {
      let musicDet = new Music();
      Object.assign(musicDet, music);

      access(music.scorePath, F_OK, (err) => {
        if (err) {
          throw new Error("Score does not exist");
        } else {
          musicDet.score = `${process.env.SCORE_URL}/${music.scoreFilename}`;
        }
      });

      let uploadedBy = await getCustomRepository(UserRepository).findUserById(
        music.uploadedById
      );
      let categories = await getCustomRepository(CategoryRepository).findByIds(
        music.categoryIds
      );
      let relatedPhrases = await getCustomRepository(
        RelatedPhrasesRepository
      ).findByIds(music.relatedPhrasesIds);

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

      let newMusic = await this.save(musicDet);
      return newMusic;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async allMusic(): Promise<Music[]> {
    let music = await this.find({
      where: { isVerified: true },
      relations: ["categories"],
    });
    return music;
  }

  async allUnverifiedMusicDetails(): Promise<Music[]> {
    let music = await this.find({
      where: { isVerified: false },
      relations: ["categories"],
    });
    return music;
  }

  async findMusicDetailsById(id: string): Promise<Music> {
    let music = await this.findOne({
      where: { id: id },
      relations: ["categories"],
    });
    if (!MusicRepository.isMusic(music)) {
      throw new Error(`Music id ${util.inspect(id)} did not retrieve a Music`);
    }
    return music;
  }

  async findMusicById(id: string): Promise<Music> {
    let obj = await this.findOne({
      where: { id: id },
      relations: ["categories"],
    });

    if (!MusicRepository.isMusic(obj)) {
      throw new Error(`Music id ${util.inspect(id)} did not retrieve a Music`);
    }
    return obj;
  }

  async findRelatedMusicIdsByQuery(query: string): Promise<string[]> {
    const result = await this.createQueryBuilder("music")
      .select("music.id")
      .where(
        "MATCH(title, composers, arrangers, description) AGAINST (:query IN BOOLEAN MODE)",
        {
          query: query.trim(),
        }
      )
      .getMany();

    let musicIds: string[] = [];
    for (let key of result) {
      musicIds.push(...key.id);
    }
    return [...new Set(musicIds)];
  }

  async updateMusic(id: string, music: UpdateMusic): Promise<Music> {
    try {
      let musicDet = await this.findMusicById(id);
      Object.assign(musicDet, music);
      let updatedMusic = await this.save(musicDet);
      return updatedMusic;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static isMusic(music: any): music is Music {
    return (
      typeof music === "object" &&
      typeof music.title === "string" &&
      typeof music.score === "string"
    );
  }
}
