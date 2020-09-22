import { AuthChecker } from "type-graphql";
import { Context } from "./context.interface";

// create auth checker function
export const authChecker: AuthChecker<Context> = (
  { context: { user } },
  role
): boolean => {
  if (!role) {
    // if `@Authorized()`, check only is user exist
    return user !== undefined;
  }
  // there are some roles defined now

  if (!user) {
    // and if no user, restrict access
    return false;
  }

  // no roles matched, restrict access
  return false;
};
