import { Field, InputType } from "type-graphql";
import { IsString, Length } from "class-validator";
import { EmailInput } from "./Email.input";

@InputType()
export class LoginUserInput extends EmailInput {
  @Field(() => String)
  @IsString()
  @Length(8, 15)
  password: string;
}
