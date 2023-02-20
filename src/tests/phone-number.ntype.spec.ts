import { Validate, validateSync } from "class-validator";
import { PhoneNumber } from "../types/phone-number.ntype";

describe(PhoneNumber.name, () => {
  it("should create a nominal type class with the correct name", () => {
    expect(PhoneNumber.name).toBe("PhoneNumber");
  });

  it("should pass validation for a valid phone number", () => {
    const validPhoneNumber = "+123456789";
    const instance = new PhoneNumber(validPhoneNumber);
    const validator = new (PhoneNumber.getValidator())();

    expect(validator.validate(validPhoneNumber)).toBe(true);
    expect(instance.isIdentical(validPhoneNumber)).toBe(true);
  });

  it("should fail validation for an invalid phone number", () => {
    const invalidPhoneNumber = "+1";
    const instance = new PhoneNumber(invalidPhoneNumber);
    const validator = new (PhoneNumber.getValidator())();

    expect(validator.validate(invalidPhoneNumber)).toBe(false);
    expect(instance.isIdentical(invalidPhoneNumber)).toBe(true);
  });

  it("should return the correct column type", () => {
    const TypeClass = new (PhoneNumber.getOrmType())();

    expect(TypeClass.getColumnType(null, null)).toBe("varchar");
  });

  it("should convert to and from the database correctly", () => {
    const instance = new PhoneNumber("+123456789");
    const TypeClass = new (PhoneNumber.getOrmType())();

    expect(TypeClass.convertToDatabaseValue(instance, null)).toBe("+123456789");
    expect(TypeClass.convertToJSValue("+123456789", null)).toEqual(instance);
  });

  it("should validate dto", () => {
    class TestDTO {
      @Validate(PhoneNumber.getValidator())
      public phoneNumber: PhoneNumber;
    }

    const invalidPhoneNumber = new PhoneNumber("+1");
    const testDto = new TestDTO();
    testDto.phoneNumber = invalidPhoneNumber;

    const errors = validateSync(testDto);

    expect(errors.length).toEqual(1);
  });
});
