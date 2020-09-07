import { EntityRepository, Repository, getRepository, getCustomRepository } from "typeorm";
import * as util from "util";
import { User } from "../entities/User";
import { CreateUser } from "../inputInterfaces/CreateUser";
import { UpdateUser } from "../inputInterfaces/UpdateUser";
import { createHmac } from "crypto";
import { LoginUser } from "../inputInterfaces/LoginUser";
import { Music } from '../entities/Music';
import { MusicRepository } from './MusicRepository';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createAndSave(user: CreateUser): Promise<User> {
    let userDet = new User();
    Object.assign(userDet, user);
    let newUser = await this.save(userDet);
    return newUser;
  }

  //testing purposes
  async allUsers(): Promise<User[]> {
    let users = await this.find();
    return users;
  }

  async findUserDetailsById(id: string): Promise<User> {
    let user = await this.findOne({
      where: { id: id },
    });
    if (!UserRepository.isUser(user)) {
      throw new Error(`User id ${util.inspect(id)} did not retrieve a User`);
    }
    return user;
  }

  async updateUser(id: string, user: UpdateUser): Promise<User> {
    try {
      let userDet = await this.findUserDetailsById(id);
      Object.assign(userDet, user);
      let updatedUser = await this.save(userDet);
      return updatedUser;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async userDownloadedMusic(userId: string, musicId: string): Promise<User> {
    try {
      let userDet = await this.findOne({
        where: { id: userId },
        relations: ["downloads"] 
      });
      if (!UserRepository.isUser(userDet)) {
        throw new Error(`User id ${util.inspect(userId)} did not retrieve a User`);
      }
      let music = await getCustomRepository(MusicRepository).findMusicById(musicId)
      userDet.downloads.push(music);
      let updatedUser = await this.save(userDet);
      return updatedUser;
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

  static isUser(user: any): user is User {
    return (
      typeof user === "object" &&
      typeof user.username === "string" &&
      typeof user.email === "string"
    );
  }
}
