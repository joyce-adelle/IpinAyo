import { CreateRelatedPhrases } from "../../db/inputInterfaces/CreateRelatedPhrases";
import { InputType, Field, ID } from "type-graphql";
import { MinLength, IsString, IsOptional, Length } from "class-validator";
import { IsId } from "../validations/Id.validation";

@InputType()
export class CreateRelatedPhrasesInput implements CreateRelatedPhrases {
  @Field(() => String)
  @IsString()
  @MinLength(3)
  phrase: string;

  @Field(() => ID, { nullable: true })
  @Length(1)
  @IsOptional()
  @IsId({ message: "$value is not a valid groupId" })
  groupId?: string;
}
