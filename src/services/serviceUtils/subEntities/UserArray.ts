import { Field, Int, ObjectType } from "type-graphql";
import { User } from "../../../db/entities/User";

@ObjectType()
export class UserArray {
  @Field(() => [User])
  public users: User[];

  @Field(() => Int)
  public totalCount: number;
}
