import { Validate, validateSync } from 'class-validator';
import { LastName } from '../types';

describe(LastName.name, () => {
  it('should create a nominal type class with the correct name', () => {
    expect(LastName.name).toBe('LastName');
  });

  it('should pass validation for a valid last name', () => {
    const validName = 'Doe';
    const instance = new LastName(validName);
    const validator = new (LastName.getValidator())();

    expect(validator.validate(validName)).toBe(true);
    expect(instance.isIdentical(validName)).toBe(true);
  });

  it('should fail validation for an invalid last name', () => {
    const invalidName = 'D';
    const instance = new LastName(invalidName);
    const validator = new (LastName.getValidator())();

    expect(validator.validate(invalidName)).toBe(false);
    expect(instance.isIdentical(invalidName)).toBe(true);
  });

  it('should return the correct column type', () => {
    const TypeClass = new (LastName.getOrmType())();

    expect(TypeClass.getColumnType(null, null)).toBe('varchar');
  });

  it('should convert to and from the database correctly', () => {
    const instance = new LastName('Doe');
    const TypeClass = new (LastName.getOrmType())();

    expect(TypeClass.convertToDatabaseValue(instance, null)).toBe('Doe');
    expect(TypeClass.convertToJSValue('Doe', null)).toEqual(instance);
  });

  it('should validate dto', () => {
    class TestDTO {
      @Validate(LastName.getValidator())
      public lastName: LastName;
    }

    const invalidLastname = new LastName('D');
    const testDto = new TestDTO();
    testDto.lastName = invalidLastname;

    const errors = validateSync(testDto);

    expect(errors.length).toEqual(1);
  });
});
