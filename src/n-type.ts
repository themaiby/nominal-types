import { EntityProperty, Platform, Type } from "@mikro-orm/core";
import { TransformContext } from "@mikro-orm/core/types/Type";
import { Constructor } from "@mikro-orm/core/typings";
import { ValidatorConstraintInterface } from "class-validator";
import { NominalTypeException } from "./exceptions/nominal-type.exception";

/**
 * Factory function to create a new NominalTypeClass.
 * This is a basic fabric for creating nominal types.
 *
 * Usage:
 * ```
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
 * ```
 *
 * You can add additional methods to `Email` class to work with email data type
 *
 * @param options - Options to configure the nominal type
 * @param options.name - A string representing the name of the nominal type
 * @param options.validator - A validator constructor for the nominal type
 * @constructor
 */
export const NType = (options: {
  name: any;
  validator?: Constructor<ValidatorConstraintInterface>;
}) => {
  abstract class NominalTypeClass {
    /** @internal */
    public abstract readonly _nominalType: string;

    /**
     * Constructs a new instance of the nominal type.
     *
     * @param value - The value for the nominal type.
     */
    public constructor(public value: any) {}

    /**
     * Checks if two values of the nominal type are identical.
     *
     * @param value - The value to compare with the current instance value.
     * @returns Returns `true` if the values are identical, `false` otherwise.
     */
    public isIdentical(value: any) {
      return this.value === value;
    }

    /**
     * Returns the ORM type for this nominal type.
     *
     * @returns A constructor for the ORM type.
     */
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

    /**
     * Returns the validator constructor for this nominal type.
     *
     * @throws An exception if the validator is not defined.
     * @returns The validator constructor for this nominal type.
     */
    public static getValidator(): Constructor<ValidatorConstraintInterface> {
      if (options.validator) return options.validator;

      throw new NominalTypeException(
        `${this.name} does not have a validator defined`
      );
    }
  }

  return NominalTypeClass;
};
