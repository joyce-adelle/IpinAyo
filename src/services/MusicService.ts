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
import { UnAuthorizedError } from "./serviceUtils/errors";
import { UpdateMusic } from "../db/inputInterfaces/UpdateMusic";
import { MusicDetails } from "../db/subEntities/MusicDetails";

@Service()
export class MusicResolver {
  @InjectRepository()
  private readonly musicRepository: MusicRepository;

  async allMusic(): Promise<Music[]> {
    return this.musicRepository.all();
  }

  async allUnverifiedMusic(): Promise<Music[]> {
    return this.musicRepository.allUnverified();
  }

  async musicDetails(musicId: string): Promise<MusicDetails> {
    return this.musicRepository.findDetailsById(musicId);
  }

  async uploadMusic(user: UserInterface, music: UploadMusic): Promise<Music> {
    const musicDet = (music as unknown) as CreateMusic;
    console.log(musicDet);
    musicDet.uploadedById = user.id;
    access(music.scorePath, F_OK, (err) => {
      if (err) {
        throw new MyError("Score not found");
      } else {
        musicDet.score = `${process.env.SCORE_URL}/${music.scoreFilename}`;
      }
    });

    if (music.audioPath) {
      access(music.audioPath, F_OK, (err) => {
        if (err) {
          musicDet.audio = null;
        } else {
          musicDet.audio = `${process.env.AUDIO_URL}/${music.audioFilename}`;
        }
      });
    }

    return this.musicRepository.createAndSave(musicDet);
  }

  async deleteMusic(music: Music, user: UserInterface): Promise<boolean> {
    if (user.role == UserRole.User) throw new UnAuthorizedError();
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
  }

  async updateMusic(
    musicId: string,
    user: UserInterface,
    music: UpdateMusic
  ): Promise<Music> {
    if (user.role == UserRole.User) throw new UnAuthorizedError();
    return this.musicRepository.updateMusic(musicId, user.id, music);
  }
}
