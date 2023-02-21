import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { NType } from "../n-type";
import { countryListAllIsoData } from "../utils/valid-country-codes";
import { CountryCode2 } from "./country-code2.ntype";
import { CountryCode3 } from "./country-code3.ntype";
import { CountryNumber } from "./country-number.ntype";

@ValidatorConstraint({ name: CountryNameValidator.name, async: false })
class CountryNameValidator implements ValidatorConstraintInterface {
  private countryNames: string[] = countryListAllIsoData.map((c) => c.name);

  public validate(value: any): boolean {
    return this.countryNames.includes(value);
  }

  public defaultMessage(): string {
    return "Country name is invalid.";
  }
}

export class CountryName extends NType({
  name: "country-name",
  validator: CountryNameValidator,
}) {
  public _nominalType = CountryName.name;

  public toCode2() {
    const country = countryListAllIsoData.find((c) => c.name === this.value);

    return new CountryCode2(country?.code);
  }

  public toCode3() {
    const country = countryListAllIsoData.find((c) => c.name === this.value);

    return new CountryCode3(country?.code3);
  }

  public toNumber() {
    const country = countryListAllIsoData.find((c) => c.name === this.value);

    return new CountryNumber(country?.number);
  }
}
