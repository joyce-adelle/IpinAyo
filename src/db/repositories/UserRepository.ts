import { EntityRepository, Repository, getCustomRepository } from "typeorm";
import * as util from "util";
import { User } from "../entities/User";
import { CreateUser } from "../inputInterfaces/CreateUser";
import { UpdateUser } from "../inputInterfaces/UpdateUser";
import { createHmac } from "crypto";
import { LoginUser } from "../inputInterfaces/LoginUser";
import { MusicRepository } from "./MusicRepository";
import { UserRole } from "../../utilities/UserRoles";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createAndSave(user: CreateUser): Promise<User> {
    if (user.isComposer && !user.typeOfCompositions)
      throw new Error("Type of compositions required if user is a composer");
    if (user.typeOfCompositions) {
      if (!user.isComposer)
        throw new Error(
          "Type of compositions cannot be if user is not a composer"
        );
      if (user.typeOfCompositions.length < 1)
        throw new Error("Type of compositions required if user is a composer");
    }
    let userDet = new User();
    Object.assign(userDet, user);
    let newUser = await this.save(userDet);
    return newUser;
  }

  async findUserById(id: string): Promise<User> {
    let user = await this.findOne({
      where: { id: id },
    });
    if (!UserRepository.isUser(user)) {
      throw new Error(`User id ${util.inspect(id)} did not retrieve a User`);
    }
    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    let user = await this.findOne({
      where: { email: email },
    });
    return user;
  }

  async findOneByUsername(username: string): Promise<User> {
    let user = await this.findOne({
      where: { username: username },
    });
    return user;
  }

  async updateUser(id: string, user: UpdateUser): Promise<User> {
    try {
      let userDet = await this.findUserById(id);

      if (
        user.isComposer &&
        !user.typeOfCompositions &&
        !userDet.typeOfCompositions
      ) {
        throw new Error("Type of compositions required if user is a composer");
      }
      if (user.typeOfCompositions) {
        if (!user.isComposer && !userDet.isComposer)
          throw new Error(
            "Type of compositions cannot be if user is not a composer"
          );
        if (user.typeOfCompositions.length < 1)
          throw new Error(
            "Type of compositions required if user is a composer"
          );
      }

      Object.assign(userDet, user);
      if (userDet.isComposer === false) userDet.typeOfCompositions = [];
      let updatedUser = await this.save(userDet);
      return updatedUser;
    } catch (error) {
      throw new Error(error.message);
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
      let music = await getCustomRepository(MusicRepository).findMusicById(
        musicId
      );
      userDet.downloads.push(music);
      music.numberOfDownloads = ++music.numberOfDownloads;
      let downloaded = await this.save(userDet);
      await getCustomRepository(MusicRepository).save(music);
      return downloaded ? true : false;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findUserByEmailAndPassword(loginUser: LoginUser): Promise<User> {
    let user = await this.findOne({
      where: {
        email: loginUser.email,
        password: createHmac("sha256", loginUser.password).digest("hex"),
      },
    });
    if (!UserRepository.isUser(user)) {
      throw new Error(
        `User email ${util.inspect(loginUser.email)} did not retrieve a User`
      );
    }
    return user;
  }

  async changeUserRole(userId: string, newRole: UserRole): Promise<boolean> {
    try {
      let user = await this.findUserById(userId);
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
