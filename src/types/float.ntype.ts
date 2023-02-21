import {
  isNumber,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { NType } from "../n-type";

@ValidatorConstraint({ name: FloatValidator.name, async: false })
class FloatValidator implements ValidatorConstraintInterface {
  public validate(value: any) {
    return isNumber(value);
  }
}

export class Float extends NType({
  name: "float",
  validator: FloatValidator,
}) {
  public _nominalType = Float.name;

  public isIdentical(value: number) {
    return this.value === value;
  }

  public getValue() {
    return this.value;
  }
}
