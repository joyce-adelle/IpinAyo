import { InputType, Field } from "type-graphql";
import { CompositionType } from "../../utilities/CompositionType";
import { UpdateUser } from "../../db/inputInterfaces/UpdateUser";
import {
  IsEmail,
  IsString,
  Length,
  IsBoolean,
  ArrayUnique,
  IsOptional,
  IsEnum,
  ArrayNotEmpty,
  ArrayMaxSize,
} from "class-validator";
import { IsEmailAlreadyExist } from "../validations/Email.validation";

@InputType()
export class UpdateUserInput implements UpdateUser {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEmail()
  @IsString()
  @IsEmailAlreadyExist({
    message: "Email $value already exists",
  })
  email?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @Length(8, 30)
  password?: string;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isComposer?: boolean;

  @Field(() => [CompositionType], { nullable: true })
  @IsOptional()
  @IsEnum(CompositionType, { each: true })
  @ArrayUnique()
  @ArrayNotEmpty()
  @ArrayMaxSize(2)
  typeOfCompositions?: CompositionType[];
}
