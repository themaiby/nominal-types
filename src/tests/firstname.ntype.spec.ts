import { Firstname } from "../types";

describe("FirstName", () => {
  describe("constructor", () => {
    it("should set the value", () => {
      const value = "John";
      const firstName = new Firstname(value);

      expect(firstName.value).toBe(value);
    });
  });

  describe("isIdentical", () => {
    it("should return true if the value is identical", () => {
      const firstName = new Firstname("John");

      expect(firstName.isIdentical("John")).toBe(true);
    });

    it("should return false if the value is not identical", () => {
      const firstName = new Firstname("John");

      expect(firstName.isIdentical("Jane")).toBe(false);
    });
  });

  describe("getOrmType", () => {
    it("should return a Type class with the correct methods", () => {
      const firstName = new Firstname("John");
      const TypeClass = new (Firstname.getOrmType())();

      expect(TypeClass.getColumnType(null, null)).toBe("varchar");
      expect(TypeClass.convertToDatabaseValue(firstName, null)).toBe("John");
      expect(TypeClass.convertToJSValue("John", null)).toBeInstanceOf(
        Firstname
      );
      expect(TypeClass.convertToJSValue("John", null).value).toBe("John");
    });
  });

  describe("getValidator", () => {
    it("should return the validator class", () => {
      const validator = Firstname.getValidator();

      expect(validator).toBeDefined();
    });
  });
});
