import { InputType, Field } from "type-graphql";
import { IsString, Length } from "class-validator";
import { IsEqualTo } from "../validations/IsEqualTo.validation";

@InputType()
export class ChangePasswordInput {
  @Field(() => String)
  @IsString()
  @Length(8, 30)
  oldPassword: string;

  @Field(() => String)
  @IsString()
  @Length(8, 30)
  newPassword: string;

  @Field(() => String)
  @IsEqualTo("newPassword")
  @IsString()
  @Length(8, 30)
  confirmNewPassword: string;
}
