import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { CreateMusic } from "../db/inputInterfaces/CreateMusic";
import { MusicRepository } from "../db/repositories/MusicRepository";
import { access, unlink } from "fs";
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

@Service()
export class MusicService {
  @InjectRepository()
  private readonly musicRepository: MusicRepository;

  async allMusic(): Promise<Music[]> {
    try {
      return this.musicRepository.all();
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
      return this.musicRepository.allUnverified();
    } catch (error) {
      if (error instanceof MyError) throw error;

      console.log(error);
      throw new UnknownError();
    }
  }

  async musicDetails(musicId: string): Promise<MusicDetails> {
    try {
      const det = this.musicRepository.findDetailsById(musicId);
      if (!det) throw new MusicNotFoundError(musicId);
      return det;
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
      access(music.scorePath, F_OK, (err) => {
        if (err) {
          console.log(err);
          throw new MyError("Score not found");
        } else {
          music.score = `${process.env.SCORE_URL}/${music.scoreFilename}`;
        }
      });

      if (music.audioPath) {
        access(music.audioPath, F_OK, (err) => {
          if (err) {
            music.audio = null;
          } else {
            music.audio = `${process.env.AUDIO_URL}/${music.audioFilename}`;
          }
        });
      }
      console.log("herrrerererererere   ", music.score);
      console.log("herrrerererererere   ", music.audio);
      return (await this.musicRepository.createAndSave(music)) ? true : false;
    } catch (error) {
      if (error instanceof MyError) throw error;

      console.log(error);
      throw new UnknownError();
    }
  }

  async deleteMusic(music: Music, user: UserInterface): Promise<boolean> {
    if (!user) throw new UnAuthorizedError();
    if (user.role == UserRole.User) throw new UnAuthorizedError();
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
