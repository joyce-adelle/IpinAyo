import { ObjectType, Field } from "type-graphql";
import { Category } from "../../db/entities/Category";
import { Music } from "../../db/entities/Music";
import { RelatedPhrases } from "../../db/entities/RelatedPhrases";
import { User } from "../../db/entities/User";
import { MusicDetails } from "../../db/subEntities/MusicDetails";
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

@ObjectType()
export class MusicArray {
  @Field(() => [Music])
  public music: Music[];
}

@ObjectType()
export class CategoryArray {
  @Field(() => [Category])
  public categories: Category[];
}

@ObjectType()
export class RelatedPhrasesArray {
  @Field(() => [RelatedPhrases])
  public relatedPhrases: RelatedPhrases[];
}

export const LoginPayload = userResponse("LoginPayload", LoginType);
export const SignUpPayload = userResponse("SignUpPayload", User);
export const UserPayload = userResponse("UserPayload", User);
export const BooleanPayload = userResponse("BooleanPayload", BooleanType);
export const RelatedPhrasePayload = userResponse(
  "RelatedPhrasePayload",
  RelatedPhrases
);
export const RelatedPhrasesPayload = userResponse(
  "RelatedPhrasesPayload",
  RelatedPhrasesArray
);
export const CategoriesPayload = userResponse(
  "CategoriesPayload",
  CategoryArray
);
export const CategoryPayload = userResponse("CategoryPayload", Category);
export const MusicPayload = userResponse("MusicPayload", MusicArray);
export const MusicDetailsPayload = userResponse(
  "MusicDetailsPayload",
  MusicDetails
);
export const SingleMusicPayload = userResponse("SingleMusicPayload", Music);
