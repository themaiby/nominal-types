import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { NType } from "../n-type";
import { countryListAllIsoData } from "../utils/valid-country-codes";
import { CountryCode2 } from "./country-code2.ntype";
import { CountryCode3 } from "./country-code3.ntype";
import { CountryName } from "./country-name.ntype";

@ValidatorConstraint({ name: CountryNumberValidator.name, async: false })
class CountryNumberValidator implements ValidatorConstraintInterface {
  private countryNumbers: string[] = countryListAllIsoData.map((c) => c.number);

  public validate(value: any): boolean {
    return this.countryNumbers.includes(value);
  }

  public defaultMessage(): string {
    return "Country number is invalid.";
  }
}

export class CountryNumber extends NType({
  name: "country-number",
  validator: CountryNumberValidator,
}) {
  public _nominalType = CountryNumber.name;

  public toCode2() {
    const country = countryListAllIsoData.find((c) => c.number === this.value);

    return new CountryCode2(country?.code);
  }

  public toCode3() {
    const country = countryListAllIsoData.find((c) => c.number === this.value);

    return new CountryCode3(country?.code3);
  }

  public toName() {
    const country = countryListAllIsoData.find((c) => c.number === this.value);

    return new CountryName(country?.name);
  }
}
