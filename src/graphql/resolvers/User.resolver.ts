import {
  Resolver,
  Mutation,
  Arg,
  Ctx,
  FieldResolver,
  Root,
  Query,
  Authorized,
  Args,
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
  UserPayload,
  UsersPayload,
} from "../../services/serviceUtils/Payloads";
import { EmailInput } from "../inputs/Email.input";
import { User } from "../../db/entities/User";
import { UserRole } from "../../utilities/UserRoles";
import { IdArgs } from "../arguments/id.args";
import { ArrayArgs } from "../arguments/array.args";

@Resolver(User)
export class UserResolver {
  @Inject()
  private readonly userService: UserService;

  @Authorized<UserRole>(UserRole.Superadmin)
  @Query(() => UsersPayload, {
    complexity: ({ childComplexity, args }) => args.limit * childComplexity,
  })
  async getAllUsers(
    @Ctx() { user }: Context,
    @Args() { limit, offset }: ArrayArgs
  ) {
    try {
      return await this.userService.getAllUsers(user, limit, offset);
    } catch (e) {
      if (e instanceof MyError) return new UserError(e.message);
    }
  }

  @Authorized<UserRole>()
  @Query(() => UserPayload, { complexity: 2 })
  async getUserDetails(@Ctx() { user }: Context) {
    try {
      return await this.userService.getUserDetails(user);
    } catch (e) {
      if (e instanceof MyError) return new UserError(e.message);
    }
  }

  @Authorized<UserRole>()
  @Mutation(() => UserPayload, { complexity: 3 })
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
  @Mutation(() => BooleanPayload, { complexity: 5 })
  async changeEmail(
    @Ctx() { user }: Context,
    @Arg("newEmail") emailInput: EmailInput
  ) {
    try {
      return await this.userService.changeEmail(user, emailInput.email);
    } catch (e) {
      if (e instanceof MyError) {
        return new UserError(e.message);
      }
    }
  }

  @Authorized<UserRole>()
  @Mutation(() => BooleanPayload, { complexity: 5 })
  async changePassword(@Ctx() { user }: Context) {
    try {
      return await this.userService.changePassword(user);
    } catch (e) {
      if (e instanceof MyError) {
        return new UserError(e.message);
      }
    }
  }

  @Authorized<UserRole>(UserRole.Superadmin)
  @Mutation(() => BooleanPayload, { complexity: 3 })
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
      if (e instanceof MyError) return new UserError(e.message);
    }
  }

  @Authorized<UserRole>()
  @Mutation(() => BooleanPayload, { complexity: 2 })
  async downloadMusic(@Ctx() { user }: Context, @Args() { id }: IdArgs) {
    try {
      return await this.userService.downloadMusic(user, id);
    } catch (e) {
      if (e instanceof MyError) {
        return new UserError(e.message);
      }
    }
  }

  @FieldResolver({
    complexity: ({ args }) => args.limit * 2,
  })
  uploads(@Root() user: User, @Args() { limit, offset }: ArrayArgs) {
    return this.userService.getUserUploads(user.id, limit, offset);
  }

  @FieldResolver({
    complexity: ({ args }) => args.limit * 2,
  })
  downloads(@Root() user: User, @Args() { limit, offset }: ArrayArgs) {
    return this.userService.getUserDownloads(user.id, limit, offset);
  }
}
