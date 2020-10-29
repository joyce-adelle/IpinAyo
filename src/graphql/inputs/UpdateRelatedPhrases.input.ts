import { InputType, Field, ID } from "type-graphql";
import { IsId } from "../validations/Id.validation";
import { IsString, MinLength, IsOptional, Length } from "class-validator";

@InputType()
export class UpdateRelatedPhrasesInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(3)
  phrase?: string;

  @Field(() => ID, { nullable: true })
  @Length(1)
  @IsOptional()
  @IsId({ message: "$value is not a valid groupId" })
  groupId?: string;
}
