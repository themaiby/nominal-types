import {
  ValidationArguments,
  ValidatorConstraintInterface,
} from "class-validator";
import { NType } from "../n-type";

class FirstNameValidator implements ValidatorConstraintInterface {
  public validate(value: any, validationArguments?: ValidationArguments) {
    const nameRegex = /^[A-Za-z]{2,}$/;
    return nameRegex.test(value);
  }

  public defaultMessage(validationArguments?: ValidationArguments) {
    return `${validationArguments.value} is not a valid first name.`;
  }
}

export class Firstname extends NType({
  name: "first-name",
  validator: FirstNameValidator,
}) {
  protected _nominalType = Firstname.name;
}
