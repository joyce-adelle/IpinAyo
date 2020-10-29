import { User } from "../entities/User";
import { ScoreType } from "../../utilities/ScoreType";
import { Category } from "../entities/Category";
import { RelatedPhrases } from "../entities/RelatedPhrases";
import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class MusicDetails {
  @Field(() => ID)
  readonly id: string;

  @Field(() => String)
  score: string;

  @Field(() => String, { nullable: true })
  audio: string;

  @Field(() => String)
  title: string;

  @Field(() => String)
  description: string;

  @Field(() => String, { nullable: true })
  composers: string;

  @Field(() => String, { nullable: true })
  yearOfComposition: string;

  @Field(() => String, { nullable: true })
  arrangers: string;

  @Field(() => String, { nullable: true })
  yearOfArrangement: string;

  @Field(() => [String])
  languages: string[];

  @Field(() => ScoreType)
  scoreType: ScoreType;

  @Field(() => Boolean)
  isVerified: boolean;

  @Field(() => User)
  uploadedBy: User;

  @Field(() => [Category])
  categories: Category[];

  @Field(() => [RelatedPhrases])
  relatedPhrases: RelatedPhrases[];

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => User)
  updatedBy: User;

  @Field(() => Date, { nullable: true })
  verifiedAt: Date;

  @Field(() => User, { nullable: true })
  verifiedBy: User;
}
