import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { NType } from "../n-type";

@ValidatorConstraint({ name: PhoneNumberValidator.name, async: false })
class PhoneNumberValidator implements ValidatorConstraintInterface {
  public validate(value: any): boolean {
    const phoneNumberRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneNumberRegex.test(value);
  }

  public defaultMessage(): string {
    return "Phone number is invalid.";
  }
}

export class PhoneNumber extends NType({
  name: "phone-number",
  validator: PhoneNumberValidator,
}) {
  protected _nominalType = PhoneNumber.name;
}
