import {
  isInt,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { NType } from "../n-type";

@ValidatorConstraint({ name: IntegerValidator.name, async: false })
class IntegerValidator implements ValidatorConstraintInterface {
  public validate(value: any) {
    return isInt(value);
  }
}

export class Integer extends NType({
  name: "integer",
  validator: IntegerValidator,
}) {
  protected _nominalType = Integer.name;

  public isIdentical(value: number) {
    return this.value === value;
  }

  public getValue() {
    return this.value;
  }
}
