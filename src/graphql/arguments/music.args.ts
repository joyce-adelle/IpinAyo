import { Max, Min } from "class-validator";
import { ArgsType, Field, Int } from "type-graphql";

@ArgsType()
export class MusicArgs {
  @Field(() => Int)
  @Min(1)
  @Max(100)
  limit: number;

  @Field(() => Int)
  @Min(1)
  page: number;
}
