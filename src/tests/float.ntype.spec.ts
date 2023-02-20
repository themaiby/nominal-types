import { Validate, validateSync } from "class-validator";
import { Float } from "../types/float.ntype";

describe(Float.name, () => {
  it("should create a nominal type class with the correct name", () => {
    expect(Float.name).toBe("Float");
  });

  it("should pass validation for a float value", () => {
    const validFloat = 3.14;
    const instance = new Float(validFloat);
    const validator = new (Float.getValidator())();

    expect(validator.validate(validFloat)).toBe(true);
    expect(instance.isIdentical(validFloat)).toBe(true);
  });

  it("should not pass validation for a non-float value", () => {
    const invalidValue = "not a float";
    const validator = new (Float.getValidator())();

    expect(validator.validate(invalidValue)).toBe(false);
  });

  it("should return the correct value", () => {
    const float = 3.14;
    const instance = new Float(float);

    expect(instance.getValue()).toBe(float);
  });

  it("should validate dto", () => {
    class TestDTO {
      @Validate(Float.getValidator())
      public float: Float;
    }

    const invalidValue = "not a float";
    const testDto = new TestDTO();
    testDto.float = new Float(invalidValue as any);

    const errors = validateSync(testDto);

    expect(errors.length).toEqual(1);
  });
});
