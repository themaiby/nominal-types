import { Validate, validateSync } from "class-validator";
import { BooleanType } from "../types/boolean-type.ntype";

describe(BooleanType.name, () => {
  it("should create a nominal type class with the correct name", () => {
    expect(BooleanType.name).toBe("BooleanType");
  });

  it("should pass validation for a boolean value", () => {
    const validBoolean = true;
    const instance = new BooleanType(validBoolean);
    const validator = new (BooleanType.getValidator())();

    expect(validator.validate(validBoolean)).toBe(true);
    expect(instance.isIdentical(validBoolean)).toBe(true);
  });

  it("should not pass validation for a non-boolean value", () => {
    const invalidValue = "invalid";
    const instance = new BooleanType(invalidValue as any);
    const validator = new (BooleanType.getValidator())();

    expect(validator.validate(invalidValue)).toBe(false);
    expect(instance.isIdentical(invalidValue as any)).toBe(true);
  });

  it("should return the correct value", () => {
    const boolean = false;
    const instance = new BooleanType(boolean);

    expect(instance.getValue()).toBe(boolean);
  });

  it("should validate dto", () => {
    class TestDTO {
      @Validate(BooleanType.getValidator())
      public boolean: BooleanType;
    }

    const invalidBoolean = new BooleanType("invalid" as any);
    const testDto = new TestDTO();
    testDto.boolean = invalidBoolean;

    const errors = validateSync(testDto);

    expect(errors.length).toEqual(1);
  });
});
