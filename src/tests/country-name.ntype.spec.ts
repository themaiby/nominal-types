import { Validate, validateSync } from "class-validator";
import { CountryName } from "../types/country-name.ntype";

describe(CountryName.name, () => {
  it("should create a nominal type class with the correct name", () => {
    expect(CountryName.name).toBe("CountryName");
  });

  it("should pass validation for a valid country name", () => {
    const validName = "United States";
    const instance = new CountryName(validName);
    const validator = new (CountryName.getValidator())();

    expect(validator.validate(validName)).toBe(true);
    expect(instance.isIdentical(validName)).toBe(true);
  });

  it("should fail validation for an invalid country name", () => {
    const invalidName = "XYZ";
    const instance = new CountryName(invalidName);
    const validator = new (CountryName.getValidator())();

    expect(validator.validate(invalidName)).toBe(false);
    expect(instance.isIdentical(invalidName)).toBe(true);
  });

  it("should convert to CountryCode2 correctly", () => {
    const instance = new CountryName("United States");
    const expectedCode2 = "US";

    expect(instance.toCode2().isIdentical(expectedCode2)).toBe(true);
  });

  it("should convert to CountryCode3 correctly", () => {
    const instance = new CountryName("United States");
    const expectedCode3 = "USA";

    expect(instance.toCode3().isIdentical(expectedCode3)).toBe(true);
  });

  it("should convert to CountryNumber correctly", () => {
    const instance = new CountryName("United States");
    const expectedNumber = "840";

    expect(instance.toNumber().isIdentical(expectedNumber)).toBe(true);
  });

  it("should validate dto", () => {
    class TestDTO {
      @Validate(CountryName.getValidator())
      public countryName: CountryName;
    }

    const invalidName = new CountryName("XYZ");
    const testDto = new TestDTO();
    testDto.countryName = invalidName;

    const errors = validateSync(testDto);

    expect(errors.length).toEqual(1);
  });
});
