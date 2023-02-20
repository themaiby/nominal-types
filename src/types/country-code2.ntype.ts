import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { NType } from "../n-type";
import { countryListAllIsoData } from "../utils/valid-country-codes";
import { CountryCode3 } from "./country-code3.ntype";

@ValidatorConstraint({ name: CountryCodeValidator.name, async: false })
class CountryCodeValidator implements ValidatorConstraintInterface {
  private countryCodes: string[] = countryListAllIsoData.map((c) => c.code);

  public validate(value: any): boolean {
    return this.countryCodes.includes(value);
  }

  public defaultMessage(): string {
    return "Country code is invalid.";
  }
}

export class CountryCode2 extends NType({
  name: "country-code",
  validator: CountryCodeValidator,
}) {
  protected _nominalType = CountryCode2.name;

  public toName() {
    return new CountryCode3(
      countryListAllIsoData.find((c) => c.code === this.value).name
    );
  }

  public toNumber() {
    return new CountryCode3(
      countryListAllIsoData.find((c) => c.code === this.value).number
    );
  }

  public toCode3() {
    return new CountryCode3(
      countryListAllIsoData.find((c) => c.code === this.value).code3
    );
  }
}
