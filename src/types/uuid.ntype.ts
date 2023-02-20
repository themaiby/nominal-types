import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { v4 } from "uuid";
import { NType } from "../n-type";

@ValidatorConstraint({ name: UUIDValidator.name, async: false })
class UUIDValidator implements ValidatorConstraintInterface {
  public validate(value: any) {
    const uuidRegExp =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegExp.test(value);
  }

  public defaultMessage() {
    return "Invalid UUID format.";
  }
}

export class UUID extends NType({
  name: "uuid",
  validator: UUIDValidator,
}) {
  protected _nominalType = UUID.name;

  constructor(value: string) {
    super(value);
  }

  public static generate() {
    return new UUID(v4());
  }

  public isIdentical(other: UUID) {
    return this.value === other.value;
  }

  public toUrlFormat() {
    return this.value.replace(/-/g, "");
  }
}
