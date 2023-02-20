import { NominalTypeException } from "../exceptions/nominal-type.exception";
import { NType } from "../n-type";

describe(NType.name, () => {
  describe("getValidator", () => {
    it("should return the validator if it is specified", () => {
      const validator = jest.fn();
      const NTypeWithValidator = NType({ name: "test", validator });
      const Validator = NTypeWithValidator.getValidator();

      expect(Validator).toBe(validator);
    });

    it("should throw an exception if no validator is specified", () => {
      const NTypeWithoutValidator = NType({ name: "test" });

      expect(() => NTypeWithoutValidator.getValidator()).toThrow(
        NominalTypeException
      );
    });
  });
});
