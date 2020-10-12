import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import * as jwt from "jsonwebtoken";
import {
  InvalidEmailOrPasswordError,
  EmailAlreadyExistsError,
  UsernameAlreadyExistsError,
  CompositionsRequiredError,
  InvalidInputCompositionError,
  UserWithEmailNotFoundError,
  PasswordsDoNotMatchError,
} from "./serviceUtils/Errors";
import { UserRepository } from "../db/repositories/UserRepository";
import { User } from "../db/entities/User";
import { sendEmail } from "./serviceUtils/sendEmail";
import { SignUpUser } from "./serviceUtils/interfaces/SignUp.interface";
import { getConfirmationUrl } from "./serviceUtils/getConfirmationUrl";

@Service()
export class AutheticationService {
  @InjectRepository()
  private readonly userRepository: UserRepository;

  public async signUp(newUser: SignUpUser): Promise<User> {
    if (newUser.password !== newUser.confirmPassword)
      throw new PasswordsDoNotMatchError();

    if (await this.userRepository.findOneByEmail(newUser.email))
      throw new EmailAlreadyExistsError();

    if (await this.userRepository.findOneByUsername(newUser.username))
      throw new UsernameAlreadyExistsError();

    if (newUser.isComposer && !newUser.typeOfCompositions)
      throw new CompositionsRequiredError();

    if (newUser.typeOfCompositions) {
      if (!newUser.isComposer) throw new InvalidInputCompositionError();
      if (newUser.typeOfCompositions.length < 1)
        throw new CompositionsRequiredError();
    }

    const user = await this.userRepository.createAndSave(newUser);
    await sendEmail(user.email, getConfirmationUrl(user.id));

    return user;
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
      { expiresIn: "24h" }
    );

    return token;
  }

  async forgotPassword(email: string): Promise<boolean> {
    const userPassword = await this.userRepository.getUserPasswordByEmail(
      email
    );
    if (!userPassword) throw new UserWithEmailNotFoundError(email);
    await sendEmail(email, null, userPassword);
    return true;
  }
}
