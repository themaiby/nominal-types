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

export class Text extends NType({
  name: "text",
  validator: TextValidator,
}) {
  protected _nominalType = Text.name;

  constructor(value: string) {
    super(value);
  }

  public isIdentical(value: string) {
    return this.value === value;
  }

  public getValue() {
    return this.value;
  }
}
