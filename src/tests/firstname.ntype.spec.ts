import { Validate, validateSync } from "class-validator";
import { FirstName } from "../types";

describe(FirstName.name, () => {
  it("should create a nominal type class with the correct name", () => {
    expect(FirstName.name).toBe("FirstName");
  });

  it("should pass validation for a valid first name", () => {
    const validName = "John";
    const instance = new FirstName(validName);
      const validator = new (FirstName.getValidator())();

    expect(validator.validate(validName)).toBe(true);
    expect(instance.isIdentical(validName)).toBe(true);
  });

  it("should fail validation for an invalid first name", () => {
    const invalidName = "J";
    const instance = new FirstName(invalidName);
    const validator = new (FirstName.getValidator())();

    expect(validator.validate(invalidName)).toBe(false);
    expect(instance.isIdentical(invalidName)).toBe(true);
  });

  it("should return the correct column type", () => {
    const TypeClass = new (FirstName.getOrmType())();

    expect(TypeClass.getColumnType(null, null)).toBe("varchar");
  });

  it("should convert to and from the database correctly", () => {
    const instance = new FirstName("John");
    const TypeClass = new (FirstName.getOrmType())();

    expect(TypeClass.convertToDatabaseValue(instance, null)).toBe("John");
    expect(TypeClass.convertToJSValue("John", null)).toEqual(instance);
  });

  it("should validate dto", () => {
    class TestDTO {
      @Validate(FirstName.getValidator())
      public firstName: FirstName;
    }

    const invalidFirstname = new FirstName("J");
    const testDto = new TestDTO();
    testDto.firstName = invalidFirstname;

    const errors = validateSync(testDto);

    expect(errors.length).toEqual(1);
  });
});
