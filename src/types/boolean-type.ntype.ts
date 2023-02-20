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

export class BooleanType extends NType({
  name: "boolean",
  validator: BooleanValidator,
}) {
  protected _nominalType = BooleanType.name;

  public isIdentical(value: any) {
    return this.value === value;
  }

  public getValue() {
    return this.value;
  }
}
