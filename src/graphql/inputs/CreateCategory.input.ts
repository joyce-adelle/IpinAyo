import { CreateCategory } from "../../db/inputInterfaces/CreateCategory";
import { InputType, Field } from "type-graphql";
import { MinLength, IsString, IsOptional } from "class-validator";
import { IsId } from "../validations/Id.validation";

@InputType()
export class CreateCategoryInput implements CreateCategory {
  @Field(() => String)
  @IsString()
  @MinLength(3)
  name: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsId({ message: "$value is not a valid parentId" })
  parentId?: string;
}
