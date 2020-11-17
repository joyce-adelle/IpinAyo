import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Inject } from "typedi";
import {
  BooleanPayload,
  LoginPayload,
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

  @Query(() => LoginPayload, { complexity: 2 })
  public async login(@Arg("credentials") credentials: LoginUserInput) {
    try {
      return await this.authService.login(credentials);
    } catch (e) {
      if (e instanceof MyError) {
        return new UserError(e.message);
      }
    }
  }

  @Mutation(() => SignUpPayload, { complexity: 3 })
  public async signUp(@Arg("input") input: CreateUserInput) {
    try {
      return await this.authService.signUp(input);
    } catch (e) {
      if (e instanceof MyError) {
        return new UserError(e.message);
      }
    }
  }

  @Mutation(() => BooleanPayload, { complexity: 5 })
  public async forgotPassword(@Arg("email") { email }: EmailInput) {
    try {
      return await this.authService.forgotPassword(email);
    } catch (e) {
      if (e instanceof MyError) {
        return new UserError(e.message);
      }
    }
  }
}
