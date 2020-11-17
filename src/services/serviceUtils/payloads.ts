import { Category } from "../../db/entities/Category";
import { Music } from "../../db/entities/Music";
import { RelatedPhrases } from "../../db/entities/RelatedPhrases";
import { User } from "../../db/entities/User";

import { BooleanType } from "./subEntities/BooleanType";
import { CategoryArray } from "./subEntities/CategoryArray";
import { LoginType } from "./subEntities/LoginType";
import { MusicArray } from "./subEntities/MusicArray";
import { MusicDetails } from "./subEntities/MusicDetails";
import { RelatedPhrasesArray } from "./subEntities/RelatedPhrasesArray";
import { UserArray } from "./subEntities/UserArray";

import { userResponse } from "../../utilities/genericTypes";

export const LoginPayload = userResponse("LoginPayload", LoginType);
export const SignUpPayload = userResponse("SignUpPayload", User);
export const UserPayload = userResponse("UserPayload", User);
export const UsersPayload = userResponse("UsersPayload", UserArray);
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
