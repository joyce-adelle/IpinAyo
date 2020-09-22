import { ObjectType, Field } from "type-graphql";
import { Category } from '../../db/entities/Category';
import { RelatedPhrases } from "../../db/entities/RelatedPhrases";
import { User } from "../../db/entities/User";
import { userResponse } from "../../utilities/genericTypes";

@ObjectType()
export class LoginType {
  @Field()
  public token: string;
}

@ObjectType()
export class BooleanType {
  @Field()
  public done: boolean;
}

export const LoginPayload = userResponse("LoginPayload", LoginType);
export const SignUpPayload = userResponse("SignUpPayload", User);
export const UserPayload = userResponse("UserPayload", User);
export const BooleanPayload = userResponse("BooleanPayload", BooleanType);
export const RelatedPhrasePayload = userResponse(
  "RelatedPhrasePayload",
  RelatedPhrases
);
export const RelatedPhrasesPayload = [RelatedPhrases];
export const CategoriesPayload = [Category];
export const CategoryPayload = userResponse("CategoryPayload", Category);
