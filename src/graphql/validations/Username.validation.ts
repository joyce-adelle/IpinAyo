import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";
import { getCustomRepository } from "typeorm";
import { UserRepository } from "../../db/repositories/UserRepository";

@ValidatorConstraint({ async: true })
class IsUsernameAlreadyExistConstraint implements ValidatorConstraintInterface {
  validate(username: string, args: ValidationArguments) {
    return getCustomRepository(UserRepository)
      .findOneByUsername(username)
      .then((user) => {
        if (user) return false;
        return true;
      });
  }
}

export function IsUsernameAlreadyExist(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUsernameAlreadyExistConstraint,
    });
  };
}
