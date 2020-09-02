import { UserRole } from "../../utilities/UserRoles";
import { CompositionType } from "../../utilities/CompositionType";


export interface CreateUser {
  username: string;
  email: string;
  password: string;
  isComposer: boolean;
  role?: UserRole;
  typeOfCompositions?: CompositionType[];
}
