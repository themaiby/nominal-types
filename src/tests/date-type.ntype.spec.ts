import { Validate, validateSync } from "class-validator";
import { DateType } from "../types/date-type.ntype";

describe(DateType.name, () => {
  it("should create a nominal type class with the correct name", () => {
    expect(DateType.name).toBe("DateType");
  });

  it("should pass validation for a valid date", () => {
    const validDate = new Date().toISOString();
    const instance = new DateType(validDate);
    const validator = new (DateType.getValidator())();

    expect(validator.validate(validDate)).toBe(true);
    expect(instance.isIdentical(validDate)).toBe(true);
  });

  it("should fail validation for an invalid date", () => {
    const invalidDate = "invalid-date";
    const instance = new DateType(invalidDate);
    const validator = new (DateType.getValidator())();

    expect(validator.validate(invalidDate)).toBe(false);
    expect(instance.isIdentical(invalidDate)).toBe(true);
  });

  it("should return the correct column type", () => {
    const TypeClass = new (DateType.getOrmType())();

    expect(TypeClass.getColumnType(null, null)).toBe("varchar");
  });

  it("should convert to and from the database correctly", () => {
    const date = new Date();
    const instance = new DateType(date.toISOString());
    const TypeClass = new (DateType.getOrmType())();

    expect(TypeClass.convertToDatabaseValue(instance, null)).toBe(
      date.toISOString()
    );
    expect(TypeClass.convertToJSValue(date.toISOString(), null)).toEqual(
      instance
    );
  });

  it("should validate dto", () => {
    class TestDTO {
      @Validate(DateType.getValidator())
      public date: DateType;
    }

    const invalidDate = new DateType("invalid-date");
    const testDto = new TestDTO();
    testDto.date = invalidDate;

    const errors = validateSync(testDto);

    expect(errors.length).toEqual(1);
  });
});
