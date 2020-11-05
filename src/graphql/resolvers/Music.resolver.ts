import {
  Resolver,
  Mutation,
  Arg,
  Query,
  Ctx,
  Root,
  FieldResolver,
  Args,
} from "type-graphql";
import { createWriteStream, existsSync, unlinkSync } from "fs";
import { parse } from "path";
import { UploadMusicInput } from "../inputs/UploadMusic.input";
import { Inject } from "typedi";
import { MusicService } from "../../services/MusicService";
import { Context } from "../../context/context.interface";
import {
  BooleanPayload,
  BooleanType,
  MusicArray,
  MusicDetailsPayload,
  MusicPayload,
  SingleMusicPayload,
} from "../../services/serviceUtils/Payloads";
import { MyError } from "../../services/serviceUtils/MyError";
import { UserError } from "../../utilities/genericTypes";
import { UpdateMusicInput } from "../inputs/UpdateMusic.input";
import { Music } from "../../db/entities/Music";
import { IdArgs } from "../arguments/id.args";
import { GetRandomString } from "../../utilities/GetRandomString";
import { SearchService } from "../../services/SearchService";
import { SearchMusicArgs } from "../arguments/search.args";

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

  @Inject()
  private readonly searchService: SearchService;

  @Query(() => MusicPayload)
  async allMusic() {
    try {
      const arrayType = new MusicArray();
      arrayType.music = await this.musicService.allMusic();
      return arrayType;
    } catch (e) {
      if (e instanceof MyError) {
        return new UserError(e.message);
      }
    }
  }

  @Query(() => MusicPayload)
  async allUnverifiedMusic(@Ctx() { user }: Context) {
    try {
      const arrayType = new MusicArray();
      arrayType.music = await this.musicService.allUnverifiedMusic(user);
      return arrayType;
    } catch (e) {
      if (e instanceof MyError) {
        return new UserError(e.message);
      }
    }
  }

  @Query(() => SingleMusicPayload)
  async getMusic(@Args() { id }: IdArgs) {
    try {
      return await this.musicService.getMusic(id);
    } catch (e) {
      if (e instanceof MyError) {
        return new UserError(e.message);
      }
    }
  }

  @Query(() => MusicDetailsPayload)
  async musicDetails(@Args() { id }: IdArgs, @Ctx() { user }: Context) {
    try {
      return await this.musicService.musicDetails(id, user);
    } catch (e) {
      if (e instanceof MyError) {
        return new UserError(e.message);
      }
    }
  }

  @Query(() => MusicPayload)
  async searchMusic(
    @Args() { query, categoryIds, exactCategory }: SearchMusicArgs
  ) {
    try {
      const arrayType = new MusicArray();
      arrayType.music = await this.searchService.filterByQuery(
        query,
        categoryIds,
        exactCategory
      );
      return arrayType;
    } catch (e) {
      if (e instanceof MyError) {
        return new UserError(e.message);
      }
    }
  }

  @Mutation(() => BooleanPayload)
  public async deleteMusic(@Args() { id }: IdArgs, @Ctx() { user }: Context) {
    try {
      const booleanType = new BooleanType();
      const done = await this.musicService.deleteMusic(id, user);
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
      if (existsSync(__dirname + `/../../../public/scores/${filename}`))
        return new UserError("score already exists");

      const path = MusicResolver.getScorePath(
        __dirname +
          `/../../../public/scores/${parse(filename).name}[@ipinayo.com].pdf`
      );

      const stream = createReadStream();
      await Store({ stream, path });

      music.scorePath = path;
      music.scoreFilename = parse(path).name;

      if (music.audioFile) {
        let { filename, mimetype, createReadStream } = await music.audioFile;
        if (mimetype.match("audio.*") == null)
          return new UserError("invalid audio file type, audio files only");

        let path = __dirname + `/../../../public/audios/${filename}`;
        if (existsSync(path)) {
          music.audioPath = path;
          music.audioFilename = filename;
        } else {
          path = MusicResolver.getAudioPath(
            __dirname +
              `/../../../public/audios/${parse(filename).name}[@ipinayo.com]${
                parse(filename).ext
              }`,
            parse(filename).ext
          );
          let stream = createReadStream();
          await Store({ stream, path });
          music.audioPath = path;
          music.audioFilename = parse(path).name;
        }
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
    @Args() { id }: IdArgs,
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
  async downloadMusic(@Ctx() { user }: Context, @Args() { id }: IdArgs) {
    try {
      const booleanType = new BooleanType();
      const done = await this.musicService.downloadMusic(user, id);
      booleanType.done = done;
      return booleanType;
    } catch (e) {
      if (e instanceof MyError) {
        return new UserError(e.message);
      }
    }
  }

  @FieldResolver()
  categories(@Root() music: Music) {
    return this.musicService.getCategories(music.id);
  }

  @FieldResolver()
  relatedPhrases(@Root() music: Music) {
    return this.musicService.getRelatedPhrases(music.id);
  }

  @FieldResolver()
  numberOfDownloads(@Root() music: Music) {
    return this.musicService.getNoOfDownloads(music.id);
  }

  private static getScorePath(path: string): string {
    if (!existsSync(path)) return path;
    return MusicResolver.getScorePath(
      __dirname +
        `/../../../public/scores/${GetRandomString(20)}[@ipinayo.com].pdf`
    );
  }

  private static getAudioPath(path: string, ext: string): string {
    if (!existsSync(path)) return path;
    return MusicResolver.getAudioPath(
      __dirname +
        `/../../../public/audios/${GetRandomString(20)}[@ipinayo.com]${ext}`,
      ext
    );
  }
}
