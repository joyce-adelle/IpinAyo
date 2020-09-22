import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { UserRepository } from "../db/repositories/UserRepository";
import { User } from "../db/entities/User";
import {
  CompositionsRequiredError,
  InvalidInputCompositionError,
  MusicNotFoundError,
  UnAuthorizedError,
  UserNotFoundError,
} from "./serviceUtils/errors";
import { UserInterface } from "../context/user.interface";
import { UserRole } from "../utilities/UserRoles";
import { UpdateUser } from "../db/inputInterfaces/UpdateUser";
import { MyDbError } from "../db/dbUtils/MyDbError";
import { MusicNotRetrieved, UserNotRetrieved } from "../db/dbUtils/DbErrors";

@Service()
export class UserService {
  @InjectRepository()
  private readonly userRepository: UserRepository;

  private async getUser(id: string): Promise<User> {
    const user = await this.userRepository.findUserById(id);
    if (!user) throw new UserNotFoundError(id);
    return user;
  }

  public async updateUser(
    user: UserInterface,
    data: UpdateUser
  ): Promise<User> {
    try {
      if (!user) throw new UnAuthorizedError();
      let userDet = await this.getUser(user.id);

      if (
        data.isComposer &&
        !data.typeOfCompositions &&
        !userDet.typeOfCompositions
      ) {
        throw new CompositionsRequiredError();
      }
      if (data.typeOfCompositions) {
        if (!data.isComposer && !userDet.isComposer)
          throw new InvalidInputCompositionError();
        if (data.typeOfCompositions.length < 1)
          throw new CompositionsRequiredError();
      }

      return await this.userRepository.updateUser(user.id, data);
    } catch (error) {
      if (error instanceof MyDbError) throw new UserNotFoundError(user.id);
      throw error;
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
      if (error instanceof MyDbError)
        throw new UserNotFoundError(userToChangeId);
      throw error;
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
      throw error;
    }
  }
}
