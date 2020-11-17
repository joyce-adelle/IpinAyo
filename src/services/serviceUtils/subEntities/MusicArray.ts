import { Field, Int, ObjectType } from "type-graphql";
import { Music } from "../../../db/entities/Music";

@ObjectType()
export class MusicArray {
  @Field(() => [Music])
  public music: Music[];

  @Field(() => Int)
  public totalCount: number;
}
