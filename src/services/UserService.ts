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
import { BooleanType } from "./serviceUtils/subEntities/BooleanType";
import { MusicArray } from "./serviceUtils/subEntities/MusicArray";
import { UserArray } from "./serviceUtils/subEntities/UserArray";

@Service()
export class UserService {
  @InjectRepository()
  private readonly userRepository: UserRepository;

  @InjectRepository()
  private readonly musicRepository: MusicRepository;

  async getAllUsers(
    user: UserInterface,
    limit: number = 20,
    offset: number = 0
  ): Promise<UserArray> {
    try {
      if (!user) throw new UnAuthorizedError();
      if (user.role !== UserRole.Superadmin) throw new UnAuthorizedError();
      const [users, totalCount] = await this.userRepository.all(limit, offset);
      return Object.assign(new UserArray(), { users, totalCount });
    } catch (error) {
      if (error instanceof MyError) throw error;

      console.log(error);
      throw new UnknownError();
    }
  }

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

  async getUserUploads(
    userId: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<MusicArray> {
    const [music, totalCount] = await this.musicRepository.findUploadsByUser(
      userId,
      limit,
      offset
    );
    return Object.assign(new MusicArray(), { music, totalCount });
  }

  async getUserDownloads(
    userId: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<MusicArray> {
    const [music, totalCount] = await this.musicRepository.findDownloadsByUser(
      userId,
      limit,
      offset
    );
    return Object.assign(new MusicArray(), { music, totalCount });
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
  ): Promise<BooleanType> {
    try {
      if (!user) throw new UnAuthorizedError();
      if (user.role !== UserRole.Superadmin) throw new UnAuthorizedError();
      const done = await this.userRepository.changeRole(
        userToChangeId,
        newRole
      );
      return Object.assign(new BooleanType(), { done });
    } catch (error) {
      if (error instanceof UserNotRetrieved)
        throw new UserNotFoundError(userToChangeId);
      if (error instanceof MyError) throw error;

      console.log(error);
      throw new UnknownError();
    }
  }

  async changeEmail(
    user: UserInterface,
    newEmail: string
  ): Promise<BooleanType> {
    try {
      if (!user) throw new UnAuthorizedError();
      console.log(user);
      await sendEmail(newEmail, getConfirmationUrl(user.id, newEmail));
      return Object.assign(new BooleanType(), { done: true });
    } catch (error) {
      if (error instanceof MyError) throw error;

      console.log(error);
      throw new UnknownError();
    }
  }

  async changePassword(user: UserInterface): Promise<BooleanType> {
    try {
      if (!user) throw new UnAuthorizedError();
      const password = await this.userRepository.findPasswordById(user.id);
      await sendEmail(
        user.email,
        getPasswordConfirmationUrl(user.id, password)
      );
      return Object.assign(new BooleanType(), { done: true });
    } catch (error) {
      if (error instanceof MyError) throw error;

      console.log(error);
      throw new UnknownError();
    }
  }

  public async downloadMusic(
    user: UserInterface,
    musicId: string
  ): Promise<BooleanType> {
    try {
      if (!user) throw new UnAuthorizedError();
      await this.userRepository.userDownloadedMusic(user.id, musicId);
      return Object.assign(new BooleanType(), { done: true });
    } catch (error) {
      if (error instanceof MyError) throw error;

      console.log(error);
      throw new UnknownError();
    }
  }
}
