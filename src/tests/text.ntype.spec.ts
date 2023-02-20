import { Validate, validateSync } from "class-validator";
import { Text } from "../types/text.ntype";

describe(Text.name, () => {
  it("should create a nominal type class with the correct name", () => {
    expect(Text.name).toBe("Text");
  });

  it("should pass validation for a text value", () => {
    const validText = "Hello, world!";
    const instance = new Text(validText);
    const validator = new (Text.getValidator())();

    expect(validator.validate(validText)).toBe(true);
    expect(instance.isIdentical(validText)).toBe(true);
  });

  it("should not pass validation for a non-text value", () => {
    const invalidValue = 12345;
    const instance = new Text(invalidValue as any);
    const validator = new (Text.getValidator())();

    expect(validator.validate(invalidValue)).toBe(false);
    expect(instance.isIdentical(invalidValue as any)).toBe(true);
  });

  it("should return the correct value", () => {
    const text = "Hello, world!";
    const instance = new Text(text);

    expect(instance.getValue()).toBe(text);
  });

  it("should validate dto", () => {
    class TestDTO {
      @Validate(Text.getValidator())
      public text: Text;
    }

    const invalidText = new Text(12345 as any);
    const testDto = new TestDTO();
    testDto.text = invalidText;

    const errors = validateSync(testDto);

    expect(errors.length).toEqual(1);
  });
});
