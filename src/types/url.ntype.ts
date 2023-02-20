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

export class Url extends NType({
  name: "url",
  validator: UrlValidator,
}) {
  protected _nominalType = Url.name;

  constructor(value: string) {
    super(value);
  }

  public static fromUrl(url: string) {
    return new Url(url);
  }

  public isIdentical(value: string) {
    return this.value === value;
  }

  public getProtocol() {
    return new URL(this.value).protocol.replace(":", "");
  }

  public getDomain() {
    return new URL(this.value).hostname;
  }

  public getPath() {
    return new URL(this.value).pathname;
  }

  public toUrl() {
    return new URL(this.value).hostname;
  }
}
