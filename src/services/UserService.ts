import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { UserRepository } from "../db/repositories/UserRepository";
import { User } from "../db/entities/User";
import {
  CompositionsRequiredError,
  InvalidInputCompositionError,
  UnAuthorizedError,
  UnknownError,
  UserNotFoundError,
} from "./serviceUtils/errors";
import { UserInterface } from "../context/user.interface";
import { UserRole } from "../utilities/UserRoles";
import { UserNotRetrieved } from "../db/dbUtils/DbErrors";
import { MyError } from "./serviceUtils/MyError";
import { getConfirmationUrl } from "./serviceUtils/getConfirmationUrl";
import { sendEmail } from "./serviceUtils/sendEmail";
import { getPasswordConfirmationUrl } from "./serviceUtils/getPasswordConfirmationUrl";
import { UserComposition } from "./serviceUtils/interfaces/UserComposition.interface";
import { MusicRepository } from "../db/repositories/MusicRepository";
import { Music } from "../db/entities/Music";

@Service()
export class UserService {
  @InjectRepository()
  private readonly userRepository: UserRepository;

  @InjectRepository()
  private readonly musicRepository: MusicRepository;

  async getUserDetails(user: UserInterface): Promise<User> {
    try {
      if (!user) throw new UnAuthorizedError();
      const userDet = await this.userRepository.findById(user.id);
      if (!userDet) throw new UserNotFoundError(user.id);
      return userDet;
    } catch (error) {
      if (error instanceof MyError) throw error;

      console.log(error);
      throw new UnknownError();
    }
  }

  async getUserUploads(userId: string): Promise<Music[]> {
    return this.musicRepository.findUploadsByUser(userId);
  }

  async getUserDownloads(userId: string): Promise<Music[]> {
    return this.musicRepository.findDownloadsByUser(userId);
  }

  public async updateUserComposition(
    user: UserInterface,
    data: UserComposition
  ): Promise<User> {
    try {
      if (!user) throw new UnAuthorizedError();
      let userDet = await this.userRepository.findById(user.id);
      if (!userDet) throw new UserNotFoundError(user.id);

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
      if (error instanceof MyError) throw error;

      console.log(error);
      throw new UnknownError();
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
      return await this.userRepository.changeRole(userToChangeId, newRole);
    } catch (error) {
      if (error instanceof UserNotRetrieved)
        throw new UserNotFoundError(userToChangeId);
      if (error instanceof MyError) throw error;

      console.log(error);
      throw new UnknownError();
    }
  }

  async changeEmail(user: UserInterface, newEmail: string): Promise<boolean> {
    try {
      if (!user) throw new UnAuthorizedError();
      console.log(user);
      await sendEmail(newEmail, getConfirmationUrl(user.id, newEmail));
      return true;
    } catch (error) {
      if (error instanceof MyError) throw error;

      console.log(error);
      throw new UnknownError();
    }
  }

  async changePassword(user: UserInterface): Promise<boolean> {
    try {
      if (!user) throw new UnAuthorizedError();
      const password = await this.userRepository.findPasswordById(user.id);
      await sendEmail(
        user.email,
        getPasswordConfirmationUrl(user.id, password)
      );
      return true;
    } catch (error) {
      if (error instanceof MyError) throw error;

      console.log(error);
      throw new UnknownError();
    }
  }
}
