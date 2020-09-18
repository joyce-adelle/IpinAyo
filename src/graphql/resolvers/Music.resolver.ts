import { Resolver, Mutation, Arg, Query } from "type-graphql";
import { GraphQLUpload, FileUpload } from "graphql-upload";
import { createWriteStream, unlinkSync, existsSync } from "fs";
import { getCustomRepository } from "typeorm";
import { MusicRepository } from "../../db/repositories/MusicRepository";
import { UploadMusicInput } from "../inputs/UploadMusic.input";
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

@Resolver()
export class MusicResolver {
  private musicRepository = getCustomRepository(MusicRepository);

  @Mutation(() => Music)
  async uploadMusic(@Arg("music") music: UploadMusicInput) {
    let { filename, mimetype, createReadStream } = await music.scoreFile;
    if (mimetype !== "application/pdf") {
      throw new Error("pdf files only");
    }
    const path = __dirname + `/../../../public/scores/${filename}`;
    const stream = createReadStream();
    const saved = await Store({ stream, path });
    music.scorePath = path;
    music.scoreFilename = filename;
    if (music.audioFile) {
      let { filename, mimetype, createReadStream } = await music.audioFile;
      if (mimetype.match("audio.*") == null) {
        throw new Error("audio files only");
      }
      let path = __dirname + `/../../../public/audios/${filename}`;
      let stream = createReadStream();
      var save = await Store({ stream, path });
      music.audioPath = path;
      music.audioFilename = filename;
    }

    let newMusic = await this.musicRepository.createAndSave(music);

    return newMusic;
  }

  @Mutation(() => Boolean)
  async uploadScorec(
    @Arg("score", () => GraphQLUpload)
    { filename, mimetype, createReadStream }: FileUpload
  ) {
    if (mimetype !== "application/pdf") {
      throw new Error("pdf files only");
    }
    const path = __dirname + `/../../../public/scores/${filename}`;
    const stream = createReadStream();
    const saved = await Store({ stream, path });
    console.log(saved);
    return true;
  }
}
