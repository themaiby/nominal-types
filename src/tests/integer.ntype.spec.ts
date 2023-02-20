import { Validate, validateSync } from "class-validator";
import { Integer } from "../types/integer.ntype";

describe(Integer.name, () => {
  it("should create a nominal type class with the correct name", () => {
    expect(Integer.name).toBe("Integer");
  });

  it("should pass validation for an integer value", () => {
    const validInteger = 12345;
    const instance = new Integer(validInteger);
    const validator = new (Integer.getValidator())();

    expect(validator.validate(validInteger)).toBe(true);
    expect(instance.isIdentical(validInteger)).toBe(true);
  });

  it("should not pass validation for a non-integer value", () => {
    const invalidValue = "not an integer";
    const validator = new (Integer.getValidator())();

    expect(validator.validate(invalidValue)).toBe(false);
  });

  it("should return the correct value", () => {
    const integer = 12345;
    const instance = new Integer(integer);

    expect(instance.getValue()).toBe(integer);
  });

  it("should validate dto", () => {
    class TestDTO {
      @Validate(Integer.getValidator())
      public integer: Integer;
    }

    const invalidValue = "not an integer";
    const testDto = new TestDTO();
    testDto.integer = new Integer(invalidValue as any);

    const errors = validateSync(testDto);

    expect(errors.length).toEqual(1);
  });
});
