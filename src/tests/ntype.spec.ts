import {
  ValidationArguments,
  ValidatorConstraintInterface,
} from "class-validator";
import { NType } from "../n-type";

describe(NType.name, () => {
  it("should create a nominal type class with the correct name", () => {
    class MyNominalType extends NType({ name: "myNominalType" }) {
      _nominalType = MyNominalType.name;
    }

    expect(MyNominalType.name).toBe("MyNominalType");
  });

  it("should throw an exception if no validator is defined", () => {
    expect(() => {
      class MyNominalType extends NType({ name: "myNominalType" }) {
        _nominalType = MyNominalType.name;
      }

      MyNominalType.getValidator();
    }).toThrow();
  });

  it("should not throw an exception if no validator is defined", () => {
    expect(() => {
      class Validator implements ValidatorConstraintInterface {
        public validate(value: any, validationArguments?: ValidationArguments) {
          return true;
        }
      }

      class MyNominalType extends NType({
        name: "myNominalType",
        validator: Validator,
      }) {
        _nominalType = MyNominalType.name;
      }

      MyNominalType.getValidator();
    }).not.toThrow();
  });

  it("should return a Type class with the correct methods", () => {
    class MyNominalType extends NType({ name: "myNominalType" }) {
      _nominalType = MyNominalType.name;
    }

    const TypeClass = new (MyNominalType.getOrmType())();

    const instance = new MyNominalType("value");

    expect(instance.isIdentical("value")).toBe(true);
    expect(TypeClass.getColumnType(null, null)).toBe("varchar");
    expect(TypeClass.convertToDatabaseValue(instance, null)).toBe("value");
    expect(TypeClass.convertToJSValue("value", null)).toEqual(instance);
  });
});
