import { EntityRepository, Repository } from "typeorm";
import * as util from "util";
import { User } from "../entities/User";
import { CreateUser } from "../inputInterfaces/CreateUser";
import { UpdateUser } from "../inputInterfaces/UpdateUser";
import { createHmac } from "crypto";
import { LoginUser } from "../inputInterfaces/LoginUser";

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
    let users = await this.find({ loadRelationIds: true });
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
      return await this.findUserDetailsById(updatedUser.id);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findByEmailAndPassword(loginUser: LoginUser): Promise<User> {
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
