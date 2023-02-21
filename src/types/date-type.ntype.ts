import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { NType } from "../n-type";

@ValidatorConstraint({ name: DateValidator.name, async: false })
class DateValidator implements ValidatorConstraintInterface {
  public validate(value: any): boolean {
    return !isNaN(Date.parse(value));
  }

  public defaultMessage(): string {
    return "Date is invalid.";
  }
}

export class DateType extends NType({
  name: "date",
  validator: DateValidator,
}) {
  public _nominalType = DateType.name;
}
