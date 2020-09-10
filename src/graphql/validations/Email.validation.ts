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
class IsEmailAlreadyExistConstraint implements ValidatorConstraintInterface {
  validate(email: string, args: ValidationArguments) {
    return getCustomRepository(UserRepository)
      .findOneByEmail(email)
      .then((user) => {
        if (user) return false;
        return true;
      });
  }
}

export function IsEmailAlreadyExist(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEmailAlreadyExistConstraint,
    });
  };
}
