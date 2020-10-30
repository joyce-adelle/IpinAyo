import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import {
  InvalidEmailOrPasswordError,
  EmailAlreadyExistsError,
  UsernameAlreadyExistsError,
  CompositionsRequiredError,
  InvalidInputCompositionError,
  UserWithEmailNotFoundError,
  PasswordsDoNotMatchError,
  UnknownError,
  ExpiredError,
  InvalidLinkError,
} from "./serviceUtils/Errors";
import { UserRepository } from "../db/repositories/UserRepository";
import { User } from "../db/entities/User";
import { sendEmail } from "./serviceUtils/sendEmail";
import { SignUpUser } from "./serviceUtils/interfaces/SignUp.interface";
import { getConfirmationUrl } from "./serviceUtils/getConfirmationUrl";
import { MyError } from "./serviceUtils/MyError";
import { getPasswordConfirmationUrl } from "./serviceUtils/getPasswordConfirmationUrl";
import Auth from "../utilities/Auth";
import { LoginUser } from "./serviceUtils/interfaces/LoginUser.interface";
import { sign, JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { GetRandomString } from "../utilities/GetRandomString";

@Service()
export class AutheticationService {
  @InjectRepository()
  private readonly userRepository: UserRepository;

  public async signUp(newUser: SignUpUser): Promise<User> {
    try {
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
      await sendEmail(user.email, getConfirmationUrl(user.id, user.email));

      return user;
    } catch (error) {
      if (error instanceof MyError) throw error;

      console.log(error);
      throw new UnknownError();
    }
  }

  public async login(credentials: LoginUser): Promise<string> {
    try {
      const user = await this.userRepository.findByEmailAddPassword(
        credentials.email
      );
      if (!user) throw new InvalidEmailOrPasswordError();
      // if (!(await Auth.compare(credentials.password, user.password)))
      //   throw new InvalidEmailOrPasswordError();

      const token = sign(
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
    } catch (error) {
      if (error instanceof MyError) throw error;
      if (error instanceof TokenExpiredError) throw new ExpiredError();
      if (error instanceof JsonWebTokenError) throw new InvalidLinkError();

      console.log(error);
      throw new UnknownError();
    }
  }

  async forgotPassword(email: string): Promise<boolean> {
    try {
      const user = await this.userRepository.findOneByEmail(email);
      if (!user) throw new UserWithEmailNotFoundError(email);
      const password = GetRandomString(~~(Math.random() * 6) + 10);
      await sendEmail(
        user.email,
        getPasswordConfirmationUrl(user.id, await Auth.hashPassword(password)),
        password
      );
      return true;
    } catch (error) {
      if (error instanceof MyError) throw error;

      console.log(error);
      throw new UnknownError();
    }
  }
}
