import { Validate, validateSync } from "class-validator";
import { UUID } from "../types/uuid.ntype";

describe(UUID.name, () => {
  it("should create a nominal type class with the correct name", () => {
    expect(UUID.name).toBe("UUID");
  });

  it("should pass validation for a valid UUID", () => {
    const validUUID = "e124d207-9a12-4da2-b6b1-7fcaf01ffeff";
    const instance = new UUID(validUUID);
    const validator = new (UUID.getValidator())();

    expect(validator.validate(validUUID)).toBe(true);
    expect(instance.isIdentical(new UUID(validUUID))).toBe(true);
  });

  it("should fail validation for an invalid UUID", () => {
    const invalidUUID = "invalid-uuid";
    const instance = new UUID(invalidUUID);
    const validator = new (UUID.getValidator())();

    expect(validator.validate(invalidUUID)).toBe(false);
    expect(instance.isIdentical(new UUID(invalidUUID))).toBe(true);
  });

  it("should generate a new UUID", () => {
    const uuid1 = UUID.generate();
    const uuid2 = UUID.generate();

    expect(uuid1.isIdentical(uuid2)).toBe(false);
  });

  it("should convert to URL format", () => {
    const instance = new UUID("e124d207-9a12-4da2-b6b1-7fcaf01ffeff");
    const expected = "e124d2079a124da2b6b17fcaf01ffeff";

    expect(instance.toUrlFormat()).toBe(expected);
  });

  it("should validate dto", () => {
    class TestDTO {
      @Validate(UUID.getValidator())
      public id: UUID;
    }

    const invalidId = new UUID("invalid-uuid");
    const testDto = new TestDTO();
    testDto.id = invalidId;

    const errors = validateSync(testDto);

    expect(errors.length).toEqual(1);
  });
});
