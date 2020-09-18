import { UpdateCategory } from "../../db/inputInterfaces/UpdateCategory";
import { InputType, Field, ID } from "type-graphql";
import { IsString, MinLength, IsOptional, Length } from "class-validator";
import { IsId } from "../validations/Id.validation";

@InputType()
export class UpdateCategoryInput implements UpdateCategory {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(3)
  name?: string;

  @Field(() => ID, { nullable: true })
  @Length(1)
  @IsOptional()
  @IsId({ message: "$value is not a valid parentId" })
  parentId?: string;
}
