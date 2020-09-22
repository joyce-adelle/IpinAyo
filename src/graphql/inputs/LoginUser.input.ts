import { LoginUser } from "../../db/inputInterfaces/LoginUser";
import { Field, InputType } from "type-graphql";
import { IsEmail, IsString, Length } from "class-validator";

@InputType()
export class LoginUserInput implements LoginUser {
  @Field(() => String)
  @IsEmail()
  @IsString()
  email: string;

  @Field(() => String)
  @IsString()
  @Length(8, 30)
  password: string;
}
