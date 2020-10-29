import { InputType, Field, ID } from "type-graphql";
import { ScoreType } from "../../utilities/ScoreType";
import { GraphQLUpload, FileUpload } from "graphql-upload";
import { ArrayNotEmpty } from "class-validator";

@InputType()
export class UploadMusicInput {
  @Field(() => GraphQLUpload)
  scoreFile: FileUpload;

  @Field(() => String)
  title: string;

  @Field(() => String)
  description: string;

  @Field(() => ScoreType)
  scoreType: ScoreType;

  @Field(() => [String])
  languages: string[];

  @Field(() => [ID])
  @ArrayNotEmpty()
  relatedPhrasesIds: string[];

  @Field(() => [ID])
  @ArrayNotEmpty()
  categoryIds: string[];

  @Field(() => GraphQLUpload, { nullable: true })
  audioFile?: FileUpload;

  @Field(() => String, { nullable: true })
  composers?: string;

  @Field(() => String, { nullable: true })
  yearOfComposition?: string;

  @Field(() => String, { nullable: true })
  arrangers?: string;

  @Field(() => String, { nullable: true })
  yearOfArrangement?: string;

  scorePath: string;
  audioPath?: string;
  scoreFilename: string;
  audioFilename?: string;

  uploadedById: string;
  score: string;
}
