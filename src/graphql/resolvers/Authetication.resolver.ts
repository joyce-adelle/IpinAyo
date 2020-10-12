import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Inject } from "typedi";
import {
  BooleanPayload,
  BooleanType,
  LoginPayload,
  LoginType,
  SignUpPayload,
} from "../../services/serviceUtils/Payloads";
import { MyError } from "../../services/serviceUtils/MyError";
import { AutheticationService } from "../../services/AutheticationService";
import { UserError } from "../../utilities/genericTypes";
import { CreateUserInput } from "../inputs/CreateUser.input";
import { LoginUserInput } from "../inputs/LoginUser.input";
import { EmailInput } from "../inputs/Email.input";

@Resolver()
export class AuthResolver {
  @Inject()
  private readonly authService: AutheticationService;

  @Query(() => LoginPayload)
  public async login(@Arg("credentials") credentials: LoginUserInput) {
    try {
      const loginType = new LoginType();
      const token = await this.authService.login(
        credentials.email,
        credentials.password
      );

      loginType.token = token;
      return loginType;
    } catch (e) {
      if (e instanceof MyError) {
        return new UserError(e.message);
      }
    }
  }

  @Mutation(() => SignUpPayload)
  public async signUp(@Arg("input") input: CreateUserInput) {
    try {
      return await this.authService.signUp(input);
    } catch (e) {
      if (e instanceof MyError) {
        return new UserError(e.message);
      }
    }
  }

  @Mutation(() => BooleanPayload)
  public async forgotPassword(@Arg("email") emailInput: EmailInput) {
    try {
      const booleanType = new BooleanType();
      const done = await this.authService.forgotPassword(emailInput.email);
      booleanType.done = done;
      return booleanType;
    } catch (e) {
      if (e instanceof MyError) {
        return new UserError(e.message);
      }
    }
  }
}
