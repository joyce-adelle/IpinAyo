import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from "class-validator";

export function IsId(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: {
        validate(id: string, args: ValidationArguments) {
          try {
            return parseInt(id, 10) == Number(id) && Number(id) >= 0;
          } catch (error) {}
          return false;
        },
      },
    });
  };
}
