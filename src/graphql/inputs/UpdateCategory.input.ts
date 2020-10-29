import { InputType, Field, ID } from "type-graphql";
import { IsString, MinLength, IsOptional } from "class-validator";
import { IsId } from "../validations/Id.validation";

@InputType()
export class UpdateCategoryInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(3)
  name?: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsId({ message: "$value is not a valid parentId" })
  parentId?: string;
}
