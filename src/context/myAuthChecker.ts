import { AuthChecker } from "type-graphql";
import { UserRole } from "../utilities/UserRoles";
import { Context } from "./context.interface";

// create auth checker function
export const MyAuthChecker: AuthChecker<Context, UserRole> = (
  { context: { user } },
  role
): boolean => {
  if (role.length === 0) return user !== undefined;
  if (!user) return false;

  return role.includes(user.role);
};
