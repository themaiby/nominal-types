import {
  isEmail,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { NType } from "../n-type";

@ValidatorConstraint({ name: EmailValidator.name, async: false })
class EmailValidator implements ValidatorConstraintInterface {
  public validate(value: any): boolean {
    return isEmail(value);
  }

  public defaultMessage(): string {
    return "Email is invalid.";
  }
}

/**
 * Represents an email address.
 *
 * @class
 * @extends NType
 */
export class Email extends NType({
  name: "email",
  validator: EmailValidator,
}) {
  public _nominalType = Email.name;
}
