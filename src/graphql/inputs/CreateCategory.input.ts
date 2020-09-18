import { CreateCategory } from "../../db/inputInterfaces/CreateCategory";
import { InputType, Field, ID } from "type-graphql";
import { MinLength, IsString, IsOptional, Length } from "class-validator";
import { IsId } from "../validations/Id.validation";

@InputType()
export class CreateCategoryInput implements CreateCategory {
  @Field(() => String)
  @IsString()
  @MinLength(3)
  name: string;

  @Field(() => ID, { nullable: true })
  @Length(1)
  @IsOptional()
  @IsId({ message: "$value is not a valid parentId" })
  parentId?: string;
}
