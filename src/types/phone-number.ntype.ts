import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { NType } from "../n-type";

@ValidatorConstraint({ name: PhoneNumberValidator.name, async: false })
class PhoneNumberValidator implements ValidatorConstraintInterface {
  /**
   * Validate the phone number.
   * @param value - The phone number to be validated.
   * @returns Whether the phone number is valid or not.
   */
  public validate(value: any): boolean {
    const phoneNumberRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneNumberRegex.test(value);
  }

  /**
   * Get the error message if phone number is invalid.
   * @returns The error message if phone number is invalid.
   */
  public defaultMessage(): string {
    return "Phone number is invalid.";
  }
}

/**
 * Represents a phone number value.
 * @class
 * @extends NType
 */
export class PhoneNumber extends NType({
  name: "phone-number",
  validator: PhoneNumberValidator,
}) {
  protected _nominalType = PhoneNumber.name;
}
