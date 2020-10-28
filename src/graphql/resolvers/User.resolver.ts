import { Resolver, Mutation, Arg, ID, Ctx } from "type-graphql";
import { UpdateUserCompositionInput } from "../inputs/UpdateUserComposition.input";
import { ChangeUserRoleInput } from "../inputs/ChangeUserRole.input";
import { Inject } from "typedi";
import { UserService } from "../../services/UserService";
import { Context } from "../../context/context.interface";
import { MyError } from "../../services/serviceUtils/MyError";
import { UserError } from "../../utilities/genericTypes";
import {
  BooleanPayload,
  BooleanType,
  UserPayload,
} from "../../services/serviceUtils/Payloads";
import { EmailInput } from "../inputs/Email.input";
import { ChangePasswordInput } from "../inputs/ChangePassword.input";

@Resolver()
export class UserResolver {
  @Inject()
  private readonly userService: UserService;

  @Mutation(() => UserPayload)
  async updateUserComposition(
    @Ctx() { user }: Context,
    @Arg("data") data: UpdateUserCompositionInput
  ) {
    try {
      return await this.userService.updateUserComposition(user, data);
    } catch (e) {
      if (e instanceof MyError) {
        return new UserError(e.message);
      }
    }
  }

  @Mutation(() => BooleanPayload)
  async changeEmail(
    @Ctx() { user }: Context,
    @Arg("newEmail") emailInput: EmailInput
  ) {
    try {
      const booleanType = new BooleanType();
      const done = await this.userService.changeEmail(user, emailInput.email);
      booleanType.done = done;
      return booleanType;
    } catch (e) {
      if (e instanceof MyError) {
        return new UserError(e.message);
      }
    }
  }

  @Mutation(() => BooleanPayload)
  async changePassword(@Ctx() { user }: Context) {
    try {
      const booleanType = new BooleanType();
      const done = await this.userService.changePassword(user);
      booleanType.done = done;
      return booleanType;
    } catch (e) {
      if (e instanceof MyError) {
        return new UserError(e.message);
      }
    }
  }

  @Mutation(() => BooleanPayload)
  async changeUserRole(
    @Ctx() { user }: Context,
    @Arg("details") details: ChangeUserRoleInput
  ) {
    try {
      const booleanType = new BooleanType();
      const done = await this.userService.changeUserRole(
        user,
        details.userToChangeId,
        details.role
      );

      booleanType.done = done;
      return booleanType;
    } catch (e) {
      if (e instanceof MyError) {
        return new UserError(e.message);
      }
    }
  }
}
