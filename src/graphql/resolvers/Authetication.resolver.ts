import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Inject } from "typedi";
import {
  LoginPayload,
  LoginType,
  SignUpPayload,
} from "../../services/serviceUtils/payloads";
import { MyError } from "../../services/serviceUtils/MyError";
import { AutheticationService } from "../../services/AutheticationService";
import { UserError } from "../../utilities/genericTypes";
import { CreateUserInput } from "../inputs/CreateUser.input";
import { LoginUserInput } from "../inputs/LoginUser.input";

@Resolver()
export class AuthResolver {
  @Inject()
  private readonly authService: AutheticationService;

  @Query(() => LoginPayload)
  public async login(
    @Arg("credentials") credentials: LoginUserInput
  ): Promise<typeof LoginPayload> {
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
  public async signUp(
    @Arg("input") input: CreateUserInput
  ): Promise<typeof SignUpPayload> {
    try {
      return await this.authService.signUp(input);
    } catch (e) {
      if (e instanceof MyError) {
        return new UserError(e.message);
      }
    }
  }
}
