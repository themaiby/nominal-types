import { Validate, validateSync } from "class-validator";
import { Lastname } from "../types/lastname.ntype";

describe(Lastname.name, () => {
  it("should create a nominal type class with the correct name", () => {
    expect(Lastname.name).toBe("Lastname");
  });

  it("should pass validation for a valid last name", () => {
    const validName = "Doe";
    const instance = new Lastname(validName);
    const validator = new (Lastname.getValidator())();

    expect(validator.validate(validName)).toBe(true);
    expect(instance.isIdentical(validName)).toBe(true);
  });

  it("should fail validation for an invalid last name", () => {
    const invalidName = "D";
    const instance = new Lastname(invalidName);
    const validator = new (Lastname.getValidator())();

    expect(validator.validate(invalidName)).toBe(false);
    expect(instance.isIdentical(invalidName)).toBe(true);
  });

  it("should return the correct column type", () => {
    const TypeClass = new (Lastname.getOrmType())();

    expect(TypeClass.getColumnType(null, null)).toBe("varchar");
  });

  it("should convert to and from the database correctly", () => {
    const instance = new Lastname("Doe");
    const TypeClass = new (Lastname.getOrmType())();

    expect(TypeClass.convertToDatabaseValue(instance, null)).toBe("Doe");
    expect(TypeClass.convertToJSValue("Doe", null)).toEqual(instance);
  });

  it("should validate dto", () => {
    class TestDTO {
      @Validate(Lastname.getValidator())
      public lastName: Lastname;
    }

    const invalidLastname = new Lastname("D");
    const testDto = new TestDTO();
    testDto.lastName = invalidLastname;

    const errors = validateSync(testDto);

    expect(errors.length).toEqual(1);
  });
});
