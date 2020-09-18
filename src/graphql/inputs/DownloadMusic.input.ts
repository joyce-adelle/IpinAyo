import { InputType, Field, ID } from "type-graphql";
import { IsDefined, Length } from "class-validator";
import { IsId } from "../validations/Id.validation";

@InputType()
export class DownloadMusicInput {
  @Field(() => ID)
  @Length(1)
  @IsId({ message: "$value is not a valid user id" })
  @IsDefined()
  userId: string;

  @Field(() => ID)
  @Length(1)
  @IsId({ message: "$value is not a valid group id" })
  @IsDefined()
  musicId?: string;
}
