import { EntityProperty, Platform, Type } from "@mikro-orm/core";
import { TransformContext } from "@mikro-orm/core/types/Type";
import { Constructor } from "@mikro-orm/core/typings";
import { ValidatorConstraintInterface } from "class-validator";
import { NominalTypeException } from "./exceptions/nominal-type.exception";

/**
 * Basic nominal-type fabric.
 * Usage:
 *
 * class EmailValidator implements ValidatorConstraintInterface {
 *   public validate(value: any, validationArguments?: ValidationArguments) {
 *     return isEmail(value);
 *   }
 *
 *   public defaultMessage(validationArguments?: ValidationArguments) {
 *     return `${validationArguments.value} is not E-Mail.`;
 *   }
 * }
 *
 * export class Email extends NType({ name: 'email' }) {
 *   protected _nominalType = Email.name;
 * }
 *
 * Feel free to add additional methods to Email class to action with Email datatype
 *
 * @param options
 * @constructor
 */
export const NType = (options: {
  name: any;
  validator?: Constructor<ValidatorConstraintInterface>;
}) => {
  abstract class NominalTypeClass {
    protected abstract readonly _nominalType: string;

    public constructor(public value: any) {}

    public isIdentical(value: any) {
      return this.value === value;
    }

    public static getOrmType(): Constructor<Type<any>> {
      const self = this;

      class NominalOrmType extends Type<any, string> {
        public getColumnType(prop: EntityProperty, platform: Platform): string {
          return "varchar";
        }

        public convertToDatabaseValue(
          value: NominalTypeClass,
          platform: Platform,
          context?: TransformContext | boolean
        ): string {
          return value.value;
        }

        public convertToJSValue(value: string, platform: Platform) {
          // todo: find how avoid this
          // @ts-ignore
          return new self(value);
        }
      }

      return NominalOrmType;
    }

    public static getValidator(): Constructor<ValidatorConstraintInterface> {
      if (options.validator) return options.validator;

      throw new NominalTypeException(
        `${this.name} does not have a validator defined`
      );
    }
  }

  return NominalTypeClass;
};
