import { Field, Int, ObjectType } from "type-graphql";
import { RelatedPhrases } from "../../../db/entities/RelatedPhrases";

@ObjectType()
export class RelatedPhrasesArray {
  @Field(() => [RelatedPhrases])
  public relatedPhrases: RelatedPhrases[];

  @Field(() => Int)
  public totalCount: number;
}
