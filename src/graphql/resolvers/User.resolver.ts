import { Resolver, Query, Mutation, Arg, ID } from "type-graphql";
import { getCustomRepository } from "typeorm";
import { UserRepository } from "../../db/repositories/UserRepository";
import { User } from "../../db/entities/User";
import { CreateUserInput } from "../inputs/CreateUser.input";
import { UpdateUserInput } from "../inputs/UpdateUser.input";
import { LoginUserArguments } from "../inputs/LoginUser.input";
import { ChangeUserRoleInput } from "../inputs/ChangeUserRole.input";
import { DownloadMusicInput } from "../inputs/DownloadMusic.input";

@Resolver()
export class UserResolver {
  private userRepository = getCustomRepository(UserRepository);

  @Query(() => [User])
  users() {
    return this.userRepository.find();
  }

  @Query(() => User)
  user(@Arg("id", () => ID) id: string) {
    return this.userRepository.findUserById(id);
  }

  @Query(() => User)
  async loginUser(@Arg("credentials") credentials: LoginUserArguments) {
    return await this.userRepository.findUserByEmailAndPassword(credentials);
  }

  @Mutation(() => User)
  async signUpUser(@Arg("data") data: CreateUserInput) {
    return await this.userRepository.createAndSave(data);
  }

  @Mutation(() => User)
  async updateUser(@Arg("id", () => ID) id: string, @Arg("data") data: UpdateUserInput) {
    return await this.userRepository.updateUser(id, data);
  }

  @Mutation(() => Boolean)
  async changeUserRole(@Arg("details") details: ChangeUserRoleInput) {
    return await this.userRepository.changeUserRole(
      details.userId,
      details.role
    );
  }

  @Mutation(() => Boolean)
  async downloadMusic(@Arg("details") details: DownloadMusicInput) {
    return await this.userRepository.userDownloadedMusic(
      details.userId,
      details.musicId
    );
  }
}
