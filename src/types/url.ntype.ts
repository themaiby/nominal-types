import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { NType } from "../n-type";

@ValidatorConstraint({ name: UrlValidator.name, async: false })
class UrlValidator implements ValidatorConstraintInterface {
  public validate(value: any) {
    const urlRegExp = /^(https?:\/\/)?[\w-]+(\.[\w-]+)+[/#?]?.*$/i;
    return urlRegExp.test(value);
  }

  public defaultMessage() {
    return "Invalid URL format.";
  }
}

/**
 * Represents a URL.
 *
 * @class
 * @extends NType
 */
export class Url extends NType({
  name: "url",
  validator: UrlValidator,
}) {
  protected _nominalType = Url.name;

  /**
   * Creates a new `Url` instance from the given URL string.
   *
   * @param {string} url - The URL string to create a new `Url` instance from.
   * @returns {Url} A new `Url` instance created from the given URL string.
   */
  public static fromUrl(url: string) {
    return new Url(url);
  }

  /**
   * Checks whether the given value is identical to the value stored in this instance.
   *
   * @param {string} value - The value to compare with the value stored in this instance.
   * @returns {boolean} `true` if the values are identical, otherwise `false`.
   */
  public isIdentical(value: string) {
    return this.value === value;
  }

  /**
   * Returns the protocol of the URL.
   *
   * @returns {string} The protocol of the URL.
   */
  public getProtocol() {
    return new URL(this.value).protocol.replace(":", "");
  }

  /**
   * Returns the domain of the URL.
   *
   * @returns {string} The domain of the URL.
   */
  public getDomain() {
    return new URL(this.value).hostname;
  }

  /**
   * Returns the path of the URL.
   *
   * @returns {string} The path of the URL.
   */
  public getPath() {
    return new URL(this.value).pathname;
  }

  /**
   * Returns the domain of the URL in URL format.
   *
   * @returns {string} The domain of the URL in URL format.
   */
  public toUrl() {
    return new URL(this.value).hostname;
  }
}
