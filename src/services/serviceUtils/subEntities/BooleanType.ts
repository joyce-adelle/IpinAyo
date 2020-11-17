import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class BooleanType {
  @Field()
  public done: boolean;
}
