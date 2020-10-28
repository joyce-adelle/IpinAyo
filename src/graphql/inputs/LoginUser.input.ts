import { LoginUser } from "../../services/serviceUtils/interfaces/LoginUser.interface";
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
