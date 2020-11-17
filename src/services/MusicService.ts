import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { MusicRepository } from "../db/repositories/MusicRepository";
import { accessSync, existsSync, unlink } from "fs";
import { F_OK } from "constants";
import { UploadMusic } from "./serviceUtils/interfaces/UploadMusic.interface";
import { MyError } from "./serviceUtils/MyError";
import { UserInterface } from "../context/user.interface";
import { Music } from "../db/entities/Music";
import { UserRole } from "../utilities/UserRoles";
import {
  MusicNotFoundError,
  UnAuthorizedError,
  UnknownError,
} from "./serviceUtils/errors";
import { UpdateMusic } from "../db/inputInterfaces/UpdateMusic";
import { UserNotRetrieved } from "../db/dbUtils/DbErrors";
import { CategoryRepository } from "../db/repositories/CategoryRepository";
import { RelatedPhrasesRepository } from "../db/repositories/RelatedPhrasesRepository";
import { Category } from "../db/entities/Category";
import { UserRepository } from "../db/repositories/UserRepository";
import { MyDbError } from "../db/dbUtils/MyDbError";
import { MusicDetails } from "./serviceUtils/subEntities/MusicDetails";
import { BooleanType } from "./serviceUtils/subEntities/BooleanType";
import { MusicArray } from "./serviceUtils/subEntities/MusicArray";
import { RelatedPhrasesArray } from "./serviceUtils/subEntities/RelatedPhrasesArray";

@Service()
export class MusicService {
  @InjectRepository()
  private readonly musicRepository: MusicRepository;

  @InjectRepository()
  private readonly categoryRepository: CategoryRepository;

  @InjectRepository()
  private readonly relatedPhrasesRepository: RelatedPhrasesRepository;

  @InjectRepository()
  private readonly userRepository: UserRepository;

  async allMusic(limit: number = 20, page: number = 1): Promise<MusicArray> {
    try {
      const [music, totalCount] = await this.musicRepository.all(
        limit,
        (page - 1) * limit
      );
      return Object.assign(new MusicArray(), { music, totalCount });
    } catch (error) {
      if (error instanceof MyError) throw error;

      console.log(error);
      throw new UnknownError();
    }
  }

  async allUnverifiedMusic(user: UserInterface): Promise<MusicArray> {
    try {
      if (!user) throw new UnAuthorizedError();
      if (user.role == UserRole.User) throw new UnAuthorizedError();
      const [music, totalCount] = await this.musicRepository.allUnverified();
      return Object.assign(new MusicArray(), { music, totalCount });
    } catch (error) {
      if (error instanceof MyError) throw error;

      console.log(error);
      throw new UnknownError();
    }
  }

  async getMusic(id: string) {
    try {
      const music = await this.musicRepository.findById(id);
      if (!music) throw new MusicNotFoundError(id);
      return music;
    } catch (error) {
      if (error instanceof MyError) throw error;

      console.log(error);
      throw new UnknownError();
    }
  }

  async getCategories(musicId: string): Promise<Category[]> {
    return this.categoryRepository.findByMusicId(musicId);
  }

  async getRelatedPhrases(
    musicId: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<RelatedPhrasesArray> {
    const [
      relatedPhrases,
      totalCount,
    ] = await this.relatedPhrasesRepository.findByMusicId(
      musicId,
      limit,
      offset
    );
    return { relatedPhrases, totalCount };
  }

  async getNoOfDownloads(musicId: string): Promise<number> {
    return this.userRepository.findNoOfDownloads(musicId);
  }

  async musicDetails(
    musicId: string,
    user: UserInterface
  ): Promise<MusicDetails> {
    try {
      if (!user) throw new UnAuthorizedError();
      if (user.role == UserRole.User) throw new UnAuthorizedError();
      const det = await this.musicRepository.findDetailsById(musicId);
      if (!det) throw new MusicNotFoundError(musicId);
      return Object.assign(new MusicDetails(), det);
    } catch (error) {
      if (error instanceof MyError) throw error;

      console.log(error);
      throw new UnknownError();
    }
  }

  async uploadMusic(
    user: UserInterface,
    music: UploadMusic
  ): Promise<BooleanType> {
    try {
      if (!user) throw new UnAuthorizedError();
      music.uploadedById = user.id;
      accessSync(music.scorePath, F_OK);
      music.score = `${process.env.SCORE_URL}/${music.scoreFilename}`;
      if (music.audioPath) {
        if (!existsSync(music.audioPath)) music.audio = null;
        else music.audio = `${process.env.AUDIO_URL}/${music.audioFilename}`;
      }
      const mus = await this.musicRepository.createAndSave(music);
      return Object.assign(new BooleanType(), { done: mus ? true : false });
    } catch (error) {
      if (error instanceof MyError) throw error;
      if (error instanceof UserNotRetrieved) throw new UnAuthorizedError();
      if (error instanceof MyDbError) throw new MyError(error.message);

      console.log(error);
      throw new UnknownError();
    }
  }

  async deleteMusic(id: string, user: UserInterface): Promise<BooleanType> {
    if (!user) throw new UnAuthorizedError();
    if (user.role == UserRole.User) throw new UnAuthorizedError();
    const music = await this.musicRepository.findById(id);
    if (music.isVerified && user.role != UserRole.Superadmin)
      throw new UnAuthorizedError();
    if (!music) throw new MusicNotFoundError(id);
    try {
      unlink(music.score, function (err) {
        if (err) throw err;
        console.log("File deleted!");
      });
      if (music.audio) {
        unlink(music.audio, function (err) {
          if (err) throw err;
          console.log("File deleted!");
        });
      }
      const mus = await this.musicRepository.remove(music);
      return Object.assign(new BooleanType(), { done: mus ? true : false });
    } catch (error) {
      if (error instanceof MyError) throw error;

      console.log(error);
      throw new UnknownError();
    }
  }

  async updateMusic(
    musicId: string,
    user: UserInterface,
    music: UpdateMusic
  ): Promise<Music> {
    try {
      if (!user) throw new UnAuthorizedError();
      if (user.role == UserRole.User) throw new UnAuthorizedError();
      return this.musicRepository.updateMusic(musicId, user.id, music);
    } catch (error) {
      if (error instanceof MyError) throw error;

      console.log(error);
      throw new UnknownError();
    }
  }
}
