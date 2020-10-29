import { Length } from "class-validator";
import { ArgsType, Field, ID } from "type-graphql";
import { IsId } from "../validations/Id.validation";

@ArgsType()
export class IdArgs {
  @Field(() => ID)
  @Length(1)
  @IsId({ message: "$value is not a valid id" })
  id: string;
}
