import { Validate, validateSync } from "class-validator";
import { Url } from "../types/url.ntype";

describe(Url.name, () => {
  it("should create a nominal type class with the correct name", () => {
    expect(Url.name).toBe("Url");
  });

  it("should pass validation for a valid URL", () => {
    const validUrl = "https://example.com";
    const instance = new Url(validUrl);
    const validator = new (Url.getValidator())();

    expect(validator.validate(validUrl)).toBe(true);
    expect(instance.isIdentical(validUrl)).toBe(true);
  });

  it("should fail validation for an invalid URL", () => {
    const invalidUrl = "INVALID_URL";
    const instance = new Url(invalidUrl);
    const validator = new (Url.getValidator())();

    expect(validator.validate(invalidUrl)).toBe(false);
    expect(instance.isIdentical(invalidUrl)).toBe(true);
  });

  it("should return URL without protocol and slashes", () => {
    const instance = new Url("https://example.com");
    const expectedUrl = "example.com";

    expect(instance.toUrl()).toBe(expectedUrl);
  });

  it("should return URL protocol", () => {
    const instance = new Url("https://example.com");
    const expectedProtocol = "https";

    expect(instance.getProtocol()).toBe(expectedProtocol);
  });

  it("should return URL domain", () => {
    const instance = new Url("https://example.com/path/to/page");
    const expectedDomain = "example.com";

    expect(instance.getDomain()).toBe(expectedDomain);
  });

  it("should return URL path", () => {
    const instance = new Url("https://example.com/path/to/page");
    const expectedPath = "/path/to/page";

    expect(instance.getPath()).toBe(expectedPath);
  });

  it("should validate dto", () => {
    class TestDTO {
      @Validate(Url.getValidator())
      public url: Url;
    }

    const invalidUrl = new Url("example.com");
    const testDto = new TestDTO();
    testDto.url = invalidUrl;

    const errors = validateSync(testDto);

    expect(errors.length).toEqual(1);
  });

  it("should create a Url instance from a given url string", () => {
    const urlString = "https://example.com/path/to/page";
    const urlInstance = Url.fromUrl(urlString);

    expect(urlInstance instanceof Url).toBe(true);
    expect(urlInstance.isIdentical(urlString)).toBe(true);
  });
});
