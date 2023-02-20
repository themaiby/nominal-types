import { Validate, validateSync } from "class-validator";
import { Email } from "../types/email.ntype";

describe(Email.name, () => {
  it("should create a nominal type class with the correct name", () => {
    expect(Email.name).toBe("Email");
  });

  it("should pass validation for a valid email", () => {
    const validEmail = "test@example.com";
    const instance = new Email(validEmail);
    const validator = new (Email.getValidator())();

    expect(validator.validate(validEmail)).toBe(true);
    expect(instance.isIdentical(validEmail)).toBe(true);
  });

  it("should fail validation for an invalid email", () => {
    const invalidEmail = "invalid.email.com";
    const instance = new Email(invalidEmail);
    const validator = new (Email.getValidator())();

    expect(validator.validate(invalidEmail)).toBe(false);
    expect(instance.isIdentical(invalidEmail)).toBe(true);
  });

  it("should return the correct column type", () => {
    const TypeClass = new (Email.getOrmType())();

    expect(TypeClass.getColumnType(null, null)).toBe("varchar");
  });

  it("should convert to and from the database correctly", () => {
    const instance = new Email("test@example.com");
    const TypeClass = new (Email.getOrmType())();

    expect(TypeClass.convertToDatabaseValue(instance, null)).toBe(
      "test@example.com"
    );
    expect(TypeClass.convertToJSValue("test@example.com", null)).toEqual(
      instance
    );
  });

  it("should validate dto", () => {
    class TestDTO {
      @Validate(Email.getValidator())
      public email: Email;
    }

    const invalidEmail = new Email("invalid.email.com");
    const testDto = new TestDTO();
    testDto.email = invalidEmail;

    const errors = validateSync(testDto);

    expect(errors.length).toEqual(1);
  });
});
