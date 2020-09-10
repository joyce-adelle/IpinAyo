import { UpdateCategory } from "../../db/inputInterfaces/UpdateCategory";
import { InputType, Field } from "type-graphql";
import { IsString, MinLength, IsOptional } from "class-validator";
import { IsId } from "../validations/Id.validation";

@InputType()
export class UpdateCategoryInput implements UpdateCategory {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(3)
  name?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsId({ message: "$value is not a valid parentId" })
  parentId?: string;
}
