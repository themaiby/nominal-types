import { EntityProperty, Platform, Type } from "@mikro-orm/core";
import { TransformContext } from "@mikro-orm/core/types/Type";
import { Constructor } from "@mikro-orm/core/typings";
import { RuntimeException } from "@nestjs/core/errors/exceptions";
import { ValidatorConstraintInterface } from "class-validator";

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
  name: string;
  validator?: Constructor<ValidatorConstraintInterface>;
}) => {
  abstract class NominalTypeClass {
    protected abstract readonly _nominalType: string;

    public constructor(public value: string) {}

    public isIdentical(value: any) {
      return this.value === value;
    }

    public static getOrmType(): Constructor<Type<any>> {
      const instance = Object.create(this.constructor.prototype);
      const nominalTypeValue = this.prototype.value;

      class NominalOrmType extends Type<any, string> {
        public getColumnType(prop: EntityProperty, platform: Platform): string {
          return "varchar";
        }

        public convertToDatabaseValue(
          value: string,
          platform: Platform,
          context?: TransformContext | boolean
        ): string {
          return nominalTypeValue;
        }

        public convertToJSValue(value: string, platform: Platform) {
          instance.value = value;

          return instance;
        }
      }

      return NominalOrmType;
    }

    public static getValidator(): Constructor<ValidatorConstraintInterface> {
      if (!options.validator) {
        const typeName = this.name;
        throw new RuntimeException(
          `${typeName} does not have a validator defined`
        );
      }

      return options.validator;
    }
  }

  return NominalTypeClass;
};
