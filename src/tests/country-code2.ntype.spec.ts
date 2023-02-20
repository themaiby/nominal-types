import { Validate, validateSync } from "class-validator";
import { CountryCode2 } from "../types/country-code2.ntype";

describe("CountryCode2", () => {
  it("should create a nominal type class with the correct name", () => {
    expect(CountryCode2.name).toBe("CountryCode2");
  });

  it("should pass validation for a valid country code", () => {
    const validCode = "US";
    const instance = new CountryCode2(validCode);
    const validator = new (CountryCode2.getValidator())();

    expect(validator.validate(validCode)).toBe(true);
    expect(instance.isIdentical(validCode)).toBe(true);
  });

  it("should fail validation for an invalid country code", () => {
    const invalidCode = "XYZ";
    const instance = new CountryCode2(invalidCode);
    const validator = new (CountryCode2.getValidator())();

    expect(validator.validate(invalidCode)).toBe(false);
    expect(instance.isIdentical(invalidCode)).toBe(true);
  });

  it("should return the correct column type", () => {
    const TypeClass = new (CountryCode2.getOrmType())();

    expect(TypeClass.getColumnType(null, null)).toBe("varchar");
  });

  it("should convert to and from the database correctly", () => {
    const instance = new CountryCode2("US");
    const TypeClass = new (CountryCode2.getOrmType())();

    expect(TypeClass.convertToDatabaseValue(instance, null)).toBe("US");
    expect(TypeClass.convertToJSValue("US", null)).toEqual(instance);
  });

  it("should validate dto", () => {
    class TestDTO {
      @Validate(CountryCode2.getValidator())
      public countryCode: CountryCode2;
    }

    const invalidCode = new CountryCode2("XYZ");
    const testDto = new TestDTO();
    testDto.countryCode = invalidCode;

    const errors = validateSync(testDto);

    expect(errors.length).toEqual(1);
  });

  it("should convert to CountryCode3", () => {
    const code2 = new CountryCode2("US");
    const code3 = code2.toCode3();

    expect(code3.value).toEqual("USA");
  });
});
