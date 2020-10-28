import {
  Resolver,
  Mutation,
  Arg,
  Query,
  Ctx,
  ID,
  Root,
  FieldResolver,
} from "type-graphql";
import { createWriteStream, unlinkSync } from "fs";
import { UploadMusicInput } from "../inputs/UploadMusic.input";
import { Inject } from "typedi";
import { MusicService } from "../../services/MusicService";
import { Context } from "../../context/context.interface";
import {
  BooleanPayload,
  BooleanType,
  MusicDetailsPayload,
  MusicPayload,
  SingleMusicPayload,
} from "../../services/serviceUtils/Payloads";
import { MyError } from "../../services/serviceUtils/MyError";
import { UserError } from "../../utilities/genericTypes";
import { UpdateMusicInput } from "../inputs/UpdateMusic.input";
import { Music } from "../../db/entities/Music";

const Store = ({ stream, path }) => {
  return new Promise((resolve, reject) =>
    stream
      .on("error", (error) => {
        if (stream.truncated)
          // delete the truncated file
          unlinkSync(path);
        reject(error);
      })
      .pipe(createWriteStream(path))
      .on("error", (error) => reject(error))
      .on("finish", () => resolve({ path }))
  );
};

@Resolver(Music)
export class MusicResolver {
  @Inject()
  private readonly musicService: MusicService;

  @Query(() => MusicPayload)
  allMusic() {
    return this.musicService.allMusic();
  }

  @Query(() => MusicPayload)
  allUnverifiedMusic(@Ctx() { user }: Context) {
    return this.musicService.allUnverifiedMusic(user);
  }

  @FieldResolver(() => MusicDetailsPayload)
  async musicDetails(@Root() music: Music) {
    try {
      return await this.musicService.musicDetails(music.id);
    } catch (e) {
      if (e instanceof MyError) {
        return new UserError(e.message);
      }
    }
  }

  @FieldResolver(() => BooleanPayload)
  public async deleteMusic(@Root() music: Music, @Ctx() { user }: Context) {
    try {
      const booleanType = new BooleanType();
      const done = await this.musicService.deleteMusic(music, user);
      booleanType.done = done;
      return booleanType;
    } catch (e) {
      if (e instanceof MyError) {
        return new UserError(e.message);
      }
    }
  }

  @Mutation(() => BooleanPayload)
  async uploadMusic(
    @Ctx() { user }: Context,
    @Arg("music") music: UploadMusicInput
  ) {
    try {
      let { filename, mimetype, createReadStream } = await music.scoreFile;
      if (mimetype !== "application/pdf") {
        return new UserError("invalid score file type, pdf files only");
      }
      const path = __dirname + `/../../../public/scores/${filename}`;
      const stream = createReadStream();
      // await Store({ stream, path });
      music.scorePath = path;
      music.scoreFilename = filename;
      if (music.audioFile) {
        let { filename, mimetype, createReadStream } = await music.audioFile;
        if (mimetype.match("audio.*") == null) {
          return new UserError("invalid audio file type, audio files only");
        }
        let path = __dirname + `/../../../public/audios/${filename}`;
        let stream = createReadStream();
        await Store({ stream, path });
        music.audioPath = path;
        music.audioFilename = filename;
      }

      const booleanType = new BooleanType();
      const done = await this.musicService.uploadMusic(user, music);
      booleanType.done = done;
      return booleanType;
    } catch (e) {
      if (e instanceof MyError) {
        return new UserError(e.message);
      }
    }
  }

  @Mutation(() => SingleMusicPayload)
  async updateMusic(
    @Ctx() { user }: Context,
    @Arg("id", () => ID) id: string,
    @Arg("music") music: UpdateMusicInput
  ) {
    try {
      if (music.audioFile) {
        let { filename, mimetype, createReadStream } = await music.audioFile;
        if (mimetype.match("audio.*") == null) {
          return new UserError("invalid audio file type, audio files only");
        }
        let path = __dirname + `/../../../public/audios/${filename}`;
        let stream = createReadStream();
        await Store({ stream, path });
        music.audioPath = path;
        music.audioFilename = filename;
      }

      return await this.musicService.updateMusic(id, user, music);
    } catch (e) {
      if (e instanceof MyError) {
        return new UserError(e.message);
      }
    }
  }

  @Mutation(() => BooleanPayload)
  async downloadMusic(
    @Ctx() { user }: Context,
    @Arg("id", () => ID) musicId: string
  ) {
    try {
      const booleanType = new BooleanType();
      const done = await this.musicService.downloadMusic(user, musicId);
      booleanType.done = done;
      return booleanType;
    } catch (e) {
      if (e instanceof MyError) {
        return new UserError(e.message);
      }
    }
  }
}
