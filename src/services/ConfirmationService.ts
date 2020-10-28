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
import {
  verify,
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError,
} from "jsonwebtoken";

@Service()
export class ConfirmationService {
  @InjectRepository()
  private readonly userRepository: UserRepository;

  public async confirmChangedPassword(
    token: string,
    input: ChangePassword
  ): Promise<boolean> {
    try {
      if (input.newPassword !== input.confirmNewPassword)
        throw new PasswordsDoNotMatchError();

      let jwtPayload: string | any;

      if (!token) {
        return false;
      }

      jwtPayload = verify(token, process.env.JWT_SECRET);
      if (!jwtPayload) {
        return false;
      }

      if (!Auth.compare(input.oldPassword, jwtPayload.user.password))
        throw new PasswordError();

      await this.userRepository.updateUser(jwtPayload.user.id, {
        password: input.newPassword,
      });

      return true;
    } catch (error) {
      if (error instanceof MyError) throw error;
      if (error instanceof TokenExpiredError) throw new ExpiredError();
      if (error instanceof JsonWebTokenError) throw new InvalidLinkError();

      console.log(error);
      throw new UnknownError();
    }
  }

  public async confirmUser(token: string): Promise<boolean> {
    try {
      let jwtPayload: string | any;

      if (!token) {
        return false;
      }

      jwtPayload = verify(token, process.env.JWT_SECRET);
      if (!jwtPayload) {
        return false;
      }

      const userDet = await this.userRepository.findById(jwtPayload.user.id);
      if (userDet.isVerified) throw new AlreadyConfirmedError();

      await this.userRepository.updateUser(jwtPayload.user.id, {
        isVerified: true,
        email: jwtPayload.user.email,
      });

      return true;
    } catch (error) {
      if (error instanceof MyError) throw error;
      if (error instanceof TokenExpiredError) throw new ExpiredError();
      if (error instanceof JsonWebTokenError) throw new InvalidLinkError();

      console.log(error);
      throw new UnknownError();
    }
  }
}
