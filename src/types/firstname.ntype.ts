import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { NType } from "../n-type";

@ValidatorConstraint({ name: FirstNameValidator.name, async: false })
class FirstNameValidator implements ValidatorConstraintInterface {
  public validate(value: any, validationArguments?: ValidationArguments) {
    const nameRegex = /^[A-Za-z]{2,}$/;
    return nameRegex.test(value);
  }

  public defaultMessage(validationArguments?: ValidationArguments) {
    return `${validationArguments?.value ?? 'Specified value'} is not a valid first name.`;
  }
}

/**
 * Represents a first name value.
 *
 * @class
 * @extends NType
 */
export class Firstname extends NType({
  name: "first-name",
  validator: FirstNameValidator,
}) {
  public _nominalType = Firstname.name;
}
