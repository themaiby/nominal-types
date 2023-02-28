import { EntityProperty, Platform, Type } from "@mikro-orm/core";
import { TransformContext } from "@mikro-orm/core/types/Type";
import { Constructor } from "@mikro-orm/core/typings";
import {
  applyDecorators,
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from "@nestjs/common";
import { ApiProperty, ApiPropertyOptions } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import {
  IsObject,
  IsString,
  Validate,
  ValidatorConstraintInterface,
} from "class-validator";
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
  name: string;
  validator?: Constructor<ValidatorConstraintInterface>;
}) => {
  abstract class NominalTypeClass {
    /** @internal */
    public abstract readonly _nominalType: string;

    public static readonly apiPropertyOptions: ApiPropertyOptions = {
      type: String,
      example: "string",
    };

    /**
     * Constructs a new instance of the nominal type.
     *
     * @param value - The value for the nominal type.
     */
    public constructor(public value: any) {}

    public toString() {
      return this.value;
    }

    public toJSON() {
      return this.toString();
    }

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
      // eslint-disable-next-line @typescript-eslint/no-this-alias
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
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          return new self(value);
        }
      }

      return NominalOrmType;
    }

    /**
     * Returns the validator constructor for this nominal type.
     *
     * todo: probably can be protected
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

    /**
     * Basic implementation of request decorator. Can be inherited
     */
    public static getRequestDecorators() {
      return applyDecorators(
        IsObject(),
        ApiProperty(this.apiPropertyOptions),
        Validate(this.getValidator()),
        Transform(({ value }) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          return new this(value);
        })
      );
    }

    public static getResponseDecorators(propertyName: string) {
      return applyDecorators(
        ApiProperty(this.apiPropertyOptions),
        IsString(),
        Transform(({ obj }) => obj[propertyName])
      );
    }

    /**
     * Get pipe for NestJS to convert incoming params into class instantly
     */
    public static getPipe() {
      const self = this;

      return new (class implements PipeTransform<any, typeof self> {
        public transform(value: string, metadata: ArgumentMetadata): any {
          const validator = new (self.getValidator())();
          const isValid = validator.validate(value);

          if (!isValid)
            throw new BadRequestException(validator.defaultMessage());
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          return new self(value);
        }
      })();
    }
  }

  return NominalTypeClass;
};
