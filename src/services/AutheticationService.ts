import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import * as jwt from "jsonwebtoken";
import {
  InvalidEmailOrPasswordError,
  EmailAlreadyExistsError,
  UsernameAlreadyExistsError,
  CompositionsRequiredError,
  InvalidInputCompositionError,
} from "./serviceUtils/Errors";
import { UserRepository } from "../db/repositories/UserRepository";
import { User } from "../db/entities/User";
import { CreateUser } from "../db/inputInterfaces/CreateUser";

@Service()
export class AutheticationService {
  @InjectRepository()
  private readonly userRepository: UserRepository;

  public async signUp(createUser: CreateUser): Promise<User> {
    if (await this.userRepository.findOneByEmail(createUser.email))
      throw new EmailAlreadyExistsError();

    if (await this.userRepository.findOneByUsername(createUser.username))
      throw new UsernameAlreadyExistsError();

    if (createUser.isComposer && !createUser.typeOfCompositions)
      throw new CompositionsRequiredError();

    if (createUser.typeOfCompositions) {
      if (!createUser.isComposer) throw new InvalidInputCompositionError();
      if (createUser.typeOfCompositions.length < 1)
        throw new CompositionsRequiredError();
    }

    return this.userRepository.createAndSave(createUser);
  }

  public async login(email: string, password: string): Promise<string> {
    const user = await this.userRepository.findUserByEmailAndPassword({
      email: email,
      password: password,
    });

    if (!user) {
      throw new InvalidEmailOrPasswordError();
    }

    const token = jwt.sign(
      {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return token;
  }
}
