import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from "class-validator";
import { CompositionType } from "../../utilities/CompositionType";

export function CompositionIsset(
  property: string,
  validationOptions?: ValidationOptions
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "compositionIsset",
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: CompositionType[], args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as boolean)[relatedPropertyName];
          try {
            return relatedValue ? value.length > 0 : true
          } catch (error) {}
          return false;
        },
      },
    });
  };
}
