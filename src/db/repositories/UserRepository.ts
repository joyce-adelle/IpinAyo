import { EntityRepository, Repository} from "typeorm";
import { User } from "../entities/User";
import { CreateUser } from "../inputInterfaces/CreateUser";
import { UpdateUser } from "../inputInterfaces/UpdateUser";
import { createHmac } from "crypto";
import { LoginUser } from "../inputInterfaces/LoginUser";
import { MusicRepository } from "./MusicRepository";
import { UserRole } from "../../utilities/UserRoles";
import { InjectRepository } from "typeorm-typedi-extensions";
import { MusicNotRetrieved, UserNotRetrieved } from "../dbUtils/DbErrors";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  @InjectRepository()
  private readonly musicRepository: MusicRepository;

  async createAndSave(user: CreateUser): Promise<User> {
    let userDet = new User();
    Object.assign(userDet, user);
    return this.save(userDet);
  }

  async findUserById(id: string): Promise<User> {
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
    let userDet = await this.findUserById(id);
    if (!UserRepository.isUser(userDet)) throw new UserNotRetrieved(id);

    Object.assign(userDet, user);
    if (userDet.isComposer === false) userDet.typeOfCompositions = [];
    return this.save(userDet);
  }

  async userDownloadedMusic(userId: string, musicId: string): Promise<boolean> {
    let userDet = await this.findOne({
      where: { id: userId },
      relations: ["downloads"],
    });
    if (!UserRepository.isUser(userDet)) throw new UserNotRetrieved(userId);

    let music = await this.musicRepository.findMusicById(musicId);
    if (!music) throw new MusicNotRetrieved(musicId);

    userDet.downloads.push(music);
    music.numberOfDownloads = ++music.numberOfDownloads;
    let downloaded = await this.save(userDet);
    await this.musicRepository.save(music);
    return downloaded ? true : false;
  }

  async findUserByEmailAndPassword(loginUser: LoginUser): Promise<User> {
    return this.findOne({
      where: {
        email: loginUser.email,
        password: createHmac("sha256", loginUser.password).digest("hex"),
      },
    });
  }

  async changeUserRole(userId: string, newRole: UserRole): Promise<boolean> {
    let user = await this.findUserById(userId);
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
