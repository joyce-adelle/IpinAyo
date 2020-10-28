import { InputType, Field, ID } from "type-graphql";
import { ScoreType } from "../../utilities/ScoreType";
import { GraphQLUpload, FileUpload } from "graphql-upload";

@InputType()
export class UpdateMusicInput {
  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => ScoreType, { nullable: true })
  scoreType?: ScoreType;

  @Field(() => [String], { nullable: true })
  languages?: string[];

  @Field(() => [ID], { nullable: true })
  relatedPhrasesIds?: string[];

  @Field(() => [ID], { nullable: true })
  categoryIds?: string[];

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

  @Field(() => Boolean, { nullable: true })
  isVerified?: boolean;

  audioPath?: string;
  audioFilename?: string;
}
