import { Resolver, Mutation, Arg, ID, Ctx } from "type-graphql";
import { UpdateUserInput } from "../inputs/UpdateUser.input";
import { ChangeUserRoleInput } from "../inputs/ChangeUserRole.input";
import { Inject } from "typedi";
import { UserService } from "../../services/UserService";
import { Context } from "../../context/context.interface";
import { MyError } from "../../services/serviceUtils/MyError";
import { UserError } from "../../utilities/genericTypes";
import { BooleanPayload, UserPayload } from "../../services/serviceUtils/Payloads";

@Resolver()
export class UserResolver {
  @Inject()
  private readonly userService: UserService;

  @Mutation(() => UserPayload)
  async updateUser(
    @Ctx() { user }: Context,
    @Arg("data") data: UpdateUserInput
  ) {
    try {
      return await this.userService.updateUser(user, data);
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
      return await this.userService.changeUserRole(
        user,
        details.userToChangeId,
        details.role
      );
    } catch (e) {
      if (e instanceof MyError) {
        return new UserError(e.message);
      }
    }
  }

  @Mutation(() => BooleanPayload)
  async downloadMusic(
    @Ctx() { user }: Context,
    @Arg("id", () => ID) musicId: string
  ) {
    try {
      return await this.userService.downloadMusic(user, musicId);
    } catch (e) {
      if (e instanceof MyError) {
        return new UserError(e.message);
      }
    }
  }
}
