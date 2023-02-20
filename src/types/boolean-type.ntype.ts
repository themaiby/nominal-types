import {
  isBoolean,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { NType } from "../n-type";

@ValidatorConstraint({ name: BooleanValidator.name, async: false })
class BooleanValidator implements ValidatorConstraintInterface {
  public validate(value: any) {
    return isBoolean(value);
  }
}

/**
 * Represents a boolean value.
 */
export class BooleanType extends NType({
  name: "boolean",
  validator: BooleanValidator,
}) {
  /**
   * The name of the nominal type.
   *
   * @type {string}
   */
  protected _nominalType = BooleanType.name;

  /**
   * Checks if the boolean value is identical to the specified value.
   * @param value - The value to check.
   * @returns `true` if the value is identical, `false` otherwise.
   */
  public isIdentical(value: any) {
    return this.value === value;
  }

  /**
   * Returns the boolean value.
   * @returns The boolean value.
   */
  public getValue() {
    return this.value;
  }
}
