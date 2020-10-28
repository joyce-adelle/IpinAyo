import { Resolver, Mutation, Arg } from "type-graphql";
import { Inject } from "typedi";
import { ConfirmationService } from "../../services/ConfirmationService";
import { MyError } from "../../services/serviceUtils/MyError";
import {
  BooleanPayload,
  BooleanType,
} from "../../services/serviceUtils/Payloads";
import { UserError } from "../../utilities/genericTypes";
import { ChangePasswordInput } from "../inputs/ChangePassword.input";

@Resolver()
export class ConfirmUserResolver {
  @Inject()
  private readonly confirmationService: ConfirmationService;

  @Mutation(() => BooleanPayload)
  async confirmUser(@Arg("token") token: string) {
    try {
      const booleanType = new BooleanType();
      const done = await this.confirmationService.confirmUser(token);
      booleanType.done = done;
      return booleanType;
    } catch (e) {
      if (e instanceof MyError) {
        return new UserError(e.message);
      }
    }
  }

  @Mutation(() => BooleanPayload)
  async confirmChangedPassword(
    @Arg("token") token: string,
    @Arg("input") input: ChangePasswordInput
  ) {
    try {
      const booleanType = new BooleanType();
      const done = await this.confirmationService.confirmChangedPassword(
        token,
        input
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
