import { CreateRelatedPhrases } from "../../db/inputInterfaces/CreateRelatedPhrases";
import { InputType, Field } from "type-graphql";
import { MinLength, IsString, IsOptional } from "class-validator";
import { IsId } from "../validations/Id.validation";

@InputType()
export class CreateRelatedPhrasesInput implements CreateRelatedPhrases {
  @Field(() => String)
  @IsString()
  @MinLength(3)
  phrase: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsId({ message: "$value is not a valid groupId" })
  groupId?: string;
}
