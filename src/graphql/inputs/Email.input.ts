import { InputType, Field } from "type-graphql";
import { IsEmail, IsString } from "class-validator";

@InputType()
export class EmailInput {
  @Field(() => String)
  @IsEmail()
  @IsString()
  email: string;
}
