import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { MusicRepository } from "../db/repositories/MusicRepository";
import { access, accessSync, existsSync, unlink } from "fs";
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
  UserNotFoundError,
} from "./serviceUtils/errors";
import { UpdateMusic } from "../db/inputInterfaces/UpdateMusic";
import { MusicDetails } from "../db/subEntities/MusicDetails";
import { UserNotRetrieved, MusicNotRetrieved } from "../db/dbUtils/DbErrors";
import { CategoryRepository } from "../db/repositories/CategoryRepository";
import { RelatedPhrasesRepository } from "../db/repositories/RelatedPhrasesRepository";
import { Category } from "../db/entities/Category";
import { RelatedPhrases } from "../db/entities/RelatedPhrases";
import { UserRepository } from "../db/repositories/UserRepository";
import { MyDbError } from "../db/dbUtils/MyDbError";

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

  async allMusic(): Promise<Music[]> {
    try {
      return await this.musicRepository.all();
    } catch (error) {
      if (error instanceof MyError) throw error;

      console.log(error);
      throw new UnknownError();
    }
  }

  async allUnverifiedMusic(user: UserInterface): Promise<Music[]> {
    try {
      if (!user) throw new UnAuthorizedError();
      if (user.role == UserRole.User) throw new UnAuthorizedError();
      return await this.musicRepository.allUnverified();
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

  async getRelatedPhrases(musicId: string): Promise<RelatedPhrases[]> {
    return this.relatedPhrasesRepository.findByMusicId(musicId);
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

  async uploadMusic(user: UserInterface, music: UploadMusic): Promise<boolean> {
    try {
      if (!user) throw new UnAuthorizedError();
      music.uploadedById = user.id;
      accessSync(music.scorePath, F_OK);
      music.score = `${process.env.SCORE_URL}/${music.scoreFilename}`;
      if (music.audioPath) {
        if (!existsSync(music.audioPath)) music.audio = null;
        else music.audio = `${process.env.AUDIO_URL}/${music.audioFilename}`;
      }
      return (await this.musicRepository.createAndSave(music)) ? true : false;
    } catch (error) {
      if (error instanceof MyError) throw error;
      if (error instanceof UserNotRetrieved) throw new UnAuthorizedError();
      if (error instanceof MyDbError) throw new MyError(error.message);

      console.log(error);
      throw new UnknownError();
    }
  }

  async deleteMusic(id: string, user: UserInterface): Promise<boolean> {
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

      return (await this.musicRepository.remove(music)) ? true : false;
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

  public async downloadMusic(
    user: UserInterface,
    musicId: string
  ): Promise<boolean> {
    try {
      if (!user) throw new UnAuthorizedError();
      return this.musicRepository.userDownloadedMusic(user.id, musicId);
    } catch (error) {
      if (error instanceof UserNotRetrieved)
        throw new UserNotFoundError(user.id);
      if (error instanceof MusicNotRetrieved)
        throw new MusicNotFoundError(user.id);
      if (error instanceof MyError) throw error;

      console.log(error);
      throw new UnknownError();
    }
  }
}
