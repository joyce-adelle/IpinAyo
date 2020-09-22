import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { UserRepository } from "../db/repositories/UserRepository";
import { User } from "../db/entities/User";
import {
  CompositionsRequiredError,
  InvalidInputCompositionError,
  UnAuthorizedError,
  UserNotFoundError,
} from "./auth/auth.error";
import { UserInterface } from "../context/user.interface";
import { UserRole } from "../utilities/UserRoles";
import { UpdateUser } from "../db/inputInterfaces/UpdateUser";

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

      return this.userRepository.updateUser(user.id, data);
    } catch (error) {
      throw error;
    }
  }

  public async changeUserRole(
    user: UserInterface,
    userToChangeId: string,
    newRole: UserRole
  ): Promise<boolean> {
    if (user.role === UserRole.User) throw new UnAuthorizedError();
    return this.userRepository.changeUserRole(userToChangeId, newRole);
  }

  public async downloadMusic(
    user: UserInterface,
    musicId: string
  ): Promise<boolean> {
    return this.userRepository.userDownloadedMusic(user.id, musicId);
  }
}
