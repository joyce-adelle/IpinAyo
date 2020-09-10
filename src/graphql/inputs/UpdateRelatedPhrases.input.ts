import { InputType, Field } from "type-graphql";
import { UpdateRelatedPhrases } from "../../db/inputInterfaces/UpdateRelatedPhrases";
import { IsId } from "../validations/Id.validation";
import { IsString, MinLength, IsOptional } from "class-validator";

@InputType()
export class UpdateRelatedPhrasesInput implements UpdateRelatedPhrases {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(3)
  phrase?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsId({ message: "$value is not a valid groupId" })
  groupId?: string;
}
