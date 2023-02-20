import { Validate, validateSync } from "class-validator";
import { CountryNumber } from "../types/country-number.ntype";

describe(CountryNumber.name, () => {
  it("should create a nominal type class with the correct name", () => {
    expect(CountryNumber.name).toBe("CountryNumber");
  });

  it("should pass validation for a valid country number", () => {
    const validNumber = "840";
    const instance = new CountryNumber(validNumber);
    const validator = new (CountryNumber.getValidator())();

    expect(validator.validate(validNumber)).toBe(true);
    expect(instance.isIdentical(validNumber)).toBe(true);
  });

  it("should fail validation for an invalid country number", () => {
    const invalidNumber = "999";
    const instance = new CountryNumber(invalidNumber);
    const validator = new (CountryNumber.getValidator())();

    expect(validator.validate(invalidNumber)).toBe(false);
    expect(instance.isIdentical(invalidNumber)).toBe(true);
  });

  it("should convert to CountryCode2 correctly", () => {
    const instance = new CountryNumber("156");
    const expectedCode2 = "CN";

    expect(instance.toCode2().isIdentical(expectedCode2)).toBe(true);
  });

  it("should convert to CountryCode3 correctly", () => {
    const instance = new CountryNumber("840");
    const expectedCode3 = "USA";

    expect(instance.toCode3().isIdentical(expectedCode3)).toBe(true);
  });

  it("should convert to country name correctly", () => {
    const instance = new CountryNumber("276");
    const expectedName = "Germany";

    expect(instance.toName().isIdentical(expectedName)).toBe(true);
  });

  it("should validate dto", () => {
    class TestDTO {
      @Validate(CountryNumber.getValidator())
      public countryNumber: CountryNumber;
    }

    const invalidNumber = new CountryNumber("999");
    const testDto = new TestDTO();
    testDto.countryNumber = invalidNumber;

    const errors = validateSync(testDto);

    expect(errors.length).toEqual(1);
  });
});
