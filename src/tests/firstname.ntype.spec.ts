import { Validate, validateSync } from "class-validator";
import { Firstname } from "../types";

describe(Firstname.name, () => {
  it("should create a nominal type class with the correct name", () => {
    expect(Firstname.name).toBe("Firstname");
  });

  it("should pass validation for a valid first name", () => {
    const validName = "John";
    const instance = new Firstname(validName);
      const validator = new (Firstname.getValidator())();

    expect(validator.validate(validName)).toBe(true);
    expect(instance.isIdentical(validName)).toBe(true);
  });

  it("should fail validation for an invalid first name", () => {
    const invalidName = "J";
    const instance = new Firstname(invalidName);
    const validator = new (Firstname.getValidator())();

    expect(validator.validate(invalidName)).toBe(false);
    expect(instance.isIdentical(invalidName)).toBe(true);
  });

  it("should return the correct column type", () => {
    const TypeClass = new (Firstname.getOrmType())();

    expect(TypeClass.getColumnType(null, null)).toBe("varchar");
  });

  it("should convert to and from the database correctly", () => {
    const instance = new Firstname("John");
    const TypeClass = new (Firstname.getOrmType())();

    expect(TypeClass.convertToDatabaseValue(instance, null)).toBe("John");
    expect(TypeClass.convertToJSValue("John", null)).toEqual(instance);
  });

  it("should validate dto", () => {
    class TestDTO {
      @Validate(Firstname.getValidator())
      public firstName: Firstname;
    }

    const invalidFirstname = new Firstname("J");
    const testDto = new TestDTO();
    testDto.firstName = invalidFirstname;

    const errors = validateSync(testDto);

    expect(errors.length).toEqual(1);
  });
});
