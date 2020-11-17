import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import {
  PasswordsDoNotMatchError,
  UnknownError,
  PasswordError,
  AlreadyConfirmedError,
  ExpiredError,
  InvalidLinkError,
} from "./serviceUtils/Errors";
import { UserRepository } from "../db/repositories/UserRepository";
import { MyError } from "./serviceUtils/MyError";
import Auth from "../utilities/Auth";
import { ChangePassword } from "./serviceUtils/interfaces/ChangePassword.interface";
import { verify, JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { BooleanType } from "./serviceUtils/subEntities/BooleanType";

@Service()
export class ConfirmationService {
  @InjectRepository()
  private readonly userRepository: UserRepository;

  public async confirmChangedPassword(
    token: string,
    input: ChangePassword
  ): Promise<BooleanType> {
    try {
      if (input.newPassword !== input.confirmNewPassword)
        throw new PasswordsDoNotMatchError();

      let jwtPayload: string | any;

      if (!token) {
        return Object.assign(new BooleanType(), { done: false });
      }

      jwtPayload = verify(token, process.env.JWT_SECRET);
      if (!jwtPayload) {
        return Object.assign(new BooleanType(), { done: false });
      }

      if (!Auth.compare(input.oldPassword, jwtPayload.user.password))
        throw new PasswordError();

      await this.userRepository.updateUser(jwtPayload.user.id, {
        password: input.newPassword,
      });

      return Object.assign(new BooleanType(), { done: true });
    } catch (error) {
      if (error instanceof MyError) throw error;
      if (error instanceof TokenExpiredError) throw new ExpiredError();
      if (error instanceof JsonWebTokenError) throw new InvalidLinkError();

      console.log(error);
      throw new UnknownError();
    }
  }

  public async confirmUser(token: string): Promise<BooleanType> {
    try {
      let jwtPayload: string | any;

      if (!token) {
        return Object.assign(new BooleanType(), { done: false });
      }

      jwtPayload = verify(token, process.env.JWT_SECRET);
      if (!jwtPayload) {
        return Object.assign(new BooleanType(), { done: false });
      }

      const userDet = await this.userRepository.findById(jwtPayload.user.id);
      if (userDet.isVerified) throw new AlreadyConfirmedError();

      await this.userRepository.updateUser(jwtPayload.user.id, {
        isVerified: true,
        email: jwtPayload.user.email,
      });

      return Object.assign(new BooleanType(), { done: true });
    } catch (error) {
      if (error instanceof MyError) throw error;
      if (error instanceof TokenExpiredError) throw new ExpiredError();
      if (error instanceof JsonWebTokenError) throw new InvalidLinkError();

      console.log(error);
      throw new UnknownError();
    }
  }
}
