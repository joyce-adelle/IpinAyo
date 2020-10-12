import { CompositionType } from "../../../utilities/CompositionType";
import { UserRole } from "../../../utilities/UserRoles";

export interface SignUpUser {
  username: string;
  email: string;
  password: string;
  confirmPassword: string
  isComposer: boolean;
  role?: UserRole;
  typeOfCompositions?: CompositionType[];
}
