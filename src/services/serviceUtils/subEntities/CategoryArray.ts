import { Field, ObjectType } from "type-graphql";
import { Category } from "../../../db/entities/Category";

@ObjectType()
export class CategoryArray {
  @Field(() => [Category])
  public categories: Category[];
}
