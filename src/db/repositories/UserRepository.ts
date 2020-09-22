import { EntityRepository, Repository, getCustomRepository } from "typeorm";
import * as util from "util";
import { User } from "../entities/User";
import { CreateUser } from "../inputInterfaces/CreateUser";
import { UpdateUser } from "../inputInterfaces/UpdateUser";
import { createHmac } from "crypto";
import { LoginUser } from "../inputInterfaces/LoginUser";
import { MusicRepository } from "./MusicRepository";
import { UserRole } from "../../utilities/UserRoles";
import { InjectRepository } from 'typeorm-typedi-extensions';

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
    try {
      let userDet = await this.findUserById(id);
      Object.assign(userDet, user);
      if (userDet.isComposer === false) userDet.typeOfCompositions = [];
      return this.save(userDet);
    } catch (error) {
      throw error;
    }
  }

  async userDownloadedMusic(userId: string, musicId: string): Promise<boolean> {
    try {
      let userDet = await this.findOne({
        where: { id: userId },
        relations: ["downloads"],
      });
      if (!UserRepository.isUser(userDet)) {
        throw new Error(
          `User id ${util.inspect(userId)} did not retrieve a User`
        );
      }
      let music = await this.musicRepository.findMusicById(
        musicId
      );
      userDet.downloads.push(music);
      music.numberOfDownloads = ++music.numberOfDownloads;
      let downloaded = await this.save(userDet);
      await this.musicRepository.save(music);
      return downloaded ? true : false;
    } catch (error) {
      throw error;
    }
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
    try {
      let user = await this.findUserById(userId);
      if (!UserRepository.isUser(user)) {
        throw new Error(
          `User id ${util.inspect(userId)} did not retrieve a User`
        );
      }
      user.role = newRole;
      let saved = await this.save(user);
      return saved ? true : false;
    } catch (error) {
      throw error;
    }
  }

  static isUser(user: any): user is User {
    return (
      typeof user === "object" &&
      typeof user.username === "string" &&
      typeof user.email === "string"
    );
  }
}
