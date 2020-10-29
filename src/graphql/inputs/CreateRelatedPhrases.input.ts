import { InputType, Field, ID } from "type-graphql";
import { MinLength, IsString, IsOptional, Length } from "class-validator";
import { IsId } from "../validations/Id.validation";

@InputType()
export class CreateRelatedPhrasesInput {
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
