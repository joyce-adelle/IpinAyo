import { UserRole } from "../utilities/UserRoles";
import { CompositionType } from "../utilities/CompositionType";

export interface UpdateUser {
  email?: string;
  password?: string;
  isComposer?: boolean;
  role?: UserRole;
  typeOfCompositions?: CompositionType[];
}
