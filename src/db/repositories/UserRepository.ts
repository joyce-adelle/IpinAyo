import { EntityRepository, Repository } from "typeorm";
import { User } from "../entities/User";
import { CreateUser } from "../inputInterfaces/CreateUser";
import { UpdateUser } from "../inputInterfaces/UpdateUser";
import { UserRole } from "../../utilities/UserRoles";
import { UserNotRetrieved } from "../dbUtils/DbErrors";
import { Music } from "../entities/Music";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createAndSave(user: CreateUser): Promise<User> {
    let userDet = new User();
    Object.assign(userDet, user);
    return this.save(userDet);
  }

  async findById(id: string): Promise<User> {
    return this.findOne({
      where: { id: id },
    });
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.findOne({
      where: { email: email },
    });
  }

  async findOneByUsername(username: string): Promise<User> {
    return this.findOne({
      where: { username: username },
    });
  }

  async updateUser(id: string, user: UpdateUser): Promise<User> {
    let userDet = await this.findById(id);
    if (!UserRepository.isUser(userDet)) throw new UserNotRetrieved(id);

    Object.assign(userDet, user);
    if (userDet.isComposer === false) userDet.typeOfCompositions = [];
    return this.save(userDet);
  }

  async findByEmailAddPassword(email: string): Promise<User> {
    return await this.findOne({
      where: {
        email: email,
      },
      select: ["id", "role", "username", "email", "password"],
    });
  }

  async findPasswordById(id: string): Promise<string> {
    const user = await this.findOne({
      where: {
        id: id,
      },
      select: ["password"],
    });
    return user.password;
  }

  async findNoOfDownloads(musicId: string): Promise<number> {
    return await this.createQueryBuilder("user")
      .leftJoin("user.downloads", "music")
      .where("music.id = :musicId", { musicId: musicId })
      .getCount();
  }

  async changeRole(userId: string, newRole: UserRole): Promise<boolean> {
    let user = await this.findById(userId);
    if (!UserRepository.isUser(user)) throw new UserNotRetrieved(userId);

    user.role = newRole;
    let saved = await this.save(user);
    return saved ? true : false;
  }

  static isUser(user: any): user is User {
    return (
      typeof user === "object" &&
      typeof user.username === "string" &&
      typeof user.email === "string"
    );
  }
}
