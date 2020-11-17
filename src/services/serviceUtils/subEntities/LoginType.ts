import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class LoginType {
  @Field()
  public token: string;
}
