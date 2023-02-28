import { ApiPropertyOptions } from "@nestjs/swagger";
import {
  isEmail,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { NType } from "../n-type";

@ValidatorConstraint({ name: EmailValidator.name, async: false })
class EmailValidator implements ValidatorConstraintInterface {
  public validate(value: string | Email): boolean {
    return isEmail(String(value));
  }

  public defaultMessage(validationArguments?: ValidationArguments) {
    return `${validationArguments.property}: ${
      validationArguments?.value ?? "Specified value"
    } is not a valid e-mail.`;
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

  public static apiPropertyOptions: ApiPropertyOptions = {
    type: String,
    format: "email",
  };
}
