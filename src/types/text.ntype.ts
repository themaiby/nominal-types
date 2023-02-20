import {
  isString,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { NType } from "../n-type";

@ValidatorConstraint({ name: TextValidator.name, async: false })
class TextValidator implements ValidatorConstraintInterface {
  public validate(value: any) {
    return isString(value);
  }
}

/**
 * Represents a text value.
 *
 * @class
 * @extends NType
 */
export class Text extends NType({
  name: "text",
  validator: TextValidator,
}) {
  /**
   * The name of the nominal type.
   *
   * @type {string}
   */
  public _nominalType = Text.name;

  /**
   * Checks whether the given value is identical to the value stored in this instance.
   *
   * @param {string} value - The value to compare with the value stored in this instance.
   * @returns {boolean} `true` if the values are identical, otherwise `false`.
   */
  public isIdentical(value: string) {
    return this.value === value;
  }

  /**
   * Returns the value stored in this instance.
   *
   * @returns {string} The value stored in this instance.
   */
  public getValue() {
    return this.value;
  }
}
