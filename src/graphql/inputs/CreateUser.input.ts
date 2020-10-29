import { InputType, Field } from "type-graphql";
import { UserRole } from "../../utilities/UserRoles";
import { CompositionType } from "../../utilities/CompositionType";
import {
  ArrayUnique,
  IsString,
  Length,
  IsEmail,
  IsBoolean,
  IsEnum,
  ValidateIf,
  IsOptional,
  ArrayNotEmpty,
  ArrayMaxSize,
  IsDefined,
} from "class-validator";
import { IsEqualTo } from "../validations/IsEqualTo.validation";
import { EmailInput } from "./Email.input";

@InputType()
export class CreateUserInput extends EmailInput {
  @Field(() => String)
  @IsString()
  @Length(5, 30)
  username: string;

  @Field(() => String)
  @IsString()
  @Length(8, 15)
  password: string;

  @Field(() => String)
  @IsString()
  @Length(8, 15)
  @IsEqualTo("password")
  confirmPassword: string;

  @Field(() => Boolean)
  @IsBoolean()
  isComposer: boolean;

  @Field(() => UserRole, { nullable: true })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @Field(() => [CompositionType], { nullable: true })
  @ValidateIf((user) => user.isComposer == true)
  @IsDefined()
  @IsEnum(CompositionType, { each: true })
  @ArrayUnique()
  @ArrayNotEmpty()
  @ArrayMaxSize(2)
  typeOfCompositions?: CompositionType[];
}
