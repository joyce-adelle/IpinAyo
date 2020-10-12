import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { UserRepository } from "../db/repositories/UserRepository";
import { User } from "../db/entities/User";
import {
  CompositionsRequiredError,
  InvalidInputCompositionError,
  MusicNotFoundError,
  PasswordsDoNotMatchError,
  UnAuthorizedError,
  UserNotFoundError,
} from "./serviceUtils/errors";
import { UserInterface } from "../context/user.interface";
import { UserRole } from "../utilities/UserRoles";
import { MusicNotRetrieved, UserNotRetrieved } from "../db/dbUtils/DbErrors";
import { MyError } from "./serviceUtils/MyError";
import * as jwt from "jsonwebtoken";
import { getConfirmationUrl } from "./serviceUtils/getConfirmationUrl";
import { sendEmail } from "./serviceUtils/sendEmail";
import { getPasswordConfirmationUrl } from "./serviceUtils/getPasswordConfirmationUrl";
import { UserComposition } from "./serviceUtils/interfaces/UserComposition.interface";
import { ChangePassword } from "./serviceUtils/interfaces/ChangePassword.interface";

@Service()
export class UserService {
  @InjectRepository()
  private readonly userRepository: UserRepository;

  private async getUser(id: string): Promise<User> {
    const user = await this.userRepository.findUserById(id);
    if (!user) throw new UserNotFoundError(id);
    return user;
  }

  public async updateUserComposition(
    user: UserInterface,
    data: UserComposition
  ): Promise<User> {
    try {
      if (!user) throw new UnAuthorizedError();
      let userDet = await this.getUser(user.id);

      if (
        data.isComposer &&
        !data.typeOfCompositions &&
        !userDet.typeOfCompositions
      )
        throw new CompositionsRequiredError();

      if (data.typeOfCompositions) {
        if (!data.isComposer && !userDet.isComposer)
          throw new InvalidInputCompositionError();
        if (data.typeOfCompositions.length < 1)
          throw new CompositionsRequiredError();
      }

      return await this.userRepository.updateUser(user.id, data);
    } catch (error) {
      if (error instanceof UserNotRetrieved)
        throw new UserNotFoundError(user.id);
      throw new MyError(error.message);
    }
  }

  public async changeUserRole(
    user: UserInterface,
    userToChangeId: string,
    newRole: UserRole
  ): Promise<boolean> {
    try {
      if (!user) throw new UnAuthorizedError();
      if (user.role !== UserRole.Superadmin) throw new UnAuthorizedError();
      return await this.userRepository.changeUserRole(userToChangeId, newRole);
    } catch (error) {
      if (error instanceof UserNotRetrieved)
        throw new UserNotFoundError(userToChangeId);
      throw new MyError(error.message);
    }
  }

  public async downloadMusic(
    user: UserInterface,
    musicId: string
  ): Promise<boolean> {
    try {
      if (!user) throw new UnAuthorizedError();
      return this.userRepository.userDownloadedMusic(user.id, musicId);
    } catch (error) {
      if (error instanceof UserNotRetrieved)
        throw new UserNotFoundError(user.id);
      if (error instanceof MusicNotRetrieved)
        throw new MusicNotFoundError(user.id);
      throw new MyError(error.message);
    }
  }

  async changeEmail(user: UserInterface, newEmail: string): Promise<boolean> {
    if (!user) throw new UnAuthorizedError();
    await sendEmail(newEmail, getConfirmationUrl(user.id));
    return true;
  }

  public async confirmUser(token: string): Promise<boolean> {
    let jwtPayload: string | any;

    if (!token) {
      return false;
    }

    try {
      jwtPayload = jwt.verify(token, process.env.JWT_SECRET);
      if (!jwtPayload) {
        return false;
      }
      jwtPayload.user.email
        ? await this.userRepository.updateUser(jwtPayload.user.id, {
            isVerified: true,
            email: jwtPayload.user.email,
          })
        : await this.userRepository.updateUser(jwtPayload.user.id, {
            isVerified: true,
          });

      return true;
    } catch (error) {
      console.log(error);
      throw new MyError(error.message);
    }
  }

  async changePassword(
    user: UserInterface,
    input: ChangePassword
  ): Promise<boolean> {
    try {
      if (!user) throw new UnAuthorizedError();

      if (input.newPassword !== input.confirmNewPassword)
        throw new PasswordsDoNotMatchError();
      if (
        !(await this.userRepository.findUserPassword(
          user.id,
          input.oldPassword
        ))
      )
        throw new MyError("incorrect password, cannot change password");

      await sendEmail(
        user.email,
        getPasswordConfirmationUrl(user.id, input.newPassword)
      );
      return true;
    } catch (error) {
      if (error instanceof MyError) throw error;
      throw new MyError(error.message);
    }
  }

  public async confirmChangedPassword(token: string): Promise<boolean> {
    let jwtPayload: string | any;

    if (!token) {
      return false;
    }

    try {
      jwtPayload = jwt.verify(token, process.env.JWT_SECRET);
      if (!jwtPayload) {
        return false;
      }
      await this.userRepository.updateUser(jwtPayload.user.id, {
        password: jwtPayload.user.password,
      });
    } catch (error) {
      throw new MyError(error.message);
    }
    return true;
  }
}
