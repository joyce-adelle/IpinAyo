import { InputType, Field } from "type-graphql";
import { IsString, IsDefined } from "class-validator";
import { IsId } from "../validations/Id.validation";

@InputType()
export class DownloadMusicInput {
  @Field(() => String)
  @IsString()
  @IsId({ message: "$value is not a valid user id" })
  @IsDefined()
  userId: string;

  @Field(() => String)
  @IsString()
  @IsId({ message: "$value is not a valid group id" })
  @IsDefined()
  musicId?: string;
}
