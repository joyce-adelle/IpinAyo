import {
  Resolver,
  Mutation,
  Arg,
  Ctx,
  FieldResolver,
  Root,
  Query,
  Authorized,
} from "type-graphql";
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
  UserArray,
  UserPayload,
  UsersPayload,
} from "../../services/serviceUtils/Payloads";
import { EmailInput } from "../inputs/Email.input";
import { User } from "../../db/entities/User";
import { UserRole } from "../../utilities/UserRoles";

@Resolver(User)
export class UserResolver {
  @Inject()
  private readonly userService: UserService;

  @Authorized<UserRole>(UserRole.Superadmin)
  @Query(() => UsersPayload)
  async getAllUsers(@Ctx() { user }: Context) {
    try {
      const userArray = new UserArray();
      userArray.users = await this.userService.getAllUsers(user);
      return userArray;
    } catch (e) {
      if (e instanceof MyError) return new UserError(e.message);
    }
  }

  @Authorized<UserRole>()
  @Query(() => UserPayload)
  async getUserDetails(@Ctx() { user }: Context) {
    try {
      return await this.userService.getUserDetails(user);
    } catch (e) {
      if (e instanceof MyError) return new UserError(e.message);
    }
  }

  @Authorized<UserRole>()
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

  @Authorized<UserRole>()
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

  @Authorized<UserRole>()
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

  @Authorized<UserRole>(UserRole.Superadmin)
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
      if (e instanceof MyError) return new UserError(e.message);
    }
  }

  @FieldResolver()
  uploads(@Root() user: User) {
    return this.userService.getUserUploads(user.id);
  }

  @FieldResolver()
  downloads(@Root() user: User) {
    return this.userService.getUserDownloads(user.id);
  }
}
