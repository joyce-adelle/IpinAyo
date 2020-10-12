import { Resolver, Mutation, Arg } from "type-graphql";
import { Inject } from "typedi";
import { MyError } from "../../services/serviceUtils/MyError";
import {
  BooleanPayload,
  BooleanType,
} from "../../services/serviceUtils/Payloads";
import { UserService } from "../../services/UserService";
import { UserError } from "../../utilities/genericTypes";

@Resolver()
export class ConfirmUserResolver {
  @Inject()
  private readonly userService: UserService;

  @Mutation(() => BooleanPayload)
  async confirmUser(@Arg("token") token: string) {
    try {
      const booleanType = new BooleanType();
      const done = await this.userService.confirmUser(token);
      booleanType.done = done;
      return booleanType;
    } catch (e) {
      if (e instanceof MyError) {
        return new UserError(e.message);
      }
    }
  }

  @Mutation(() => BooleanPayload)
  async confirmChangedPassword(@Arg("token") token: string) {
    try {
      const booleanType = new BooleanType();
      const done = await this.userService.confirmChangedPassword(token);
      booleanType.done = done;
      return booleanType;
    } catch (e) {
      if (e instanceof MyError) {
        return new UserError(e.message);
      }
    }
  }
}
