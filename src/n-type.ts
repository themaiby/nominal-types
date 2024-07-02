import { EntityProperty, Platform, Type } from '@mikro-orm/core';
import { TransformContext } from '@mikro-orm/core/types/Type';
import { Constructor } from '@mikro-orm/core/typings';
import { applyDecorators, ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsObject, Validate, ValidatorConstraintInterface } from 'class-validator';
import { NominalTypeException } from './exceptions/nominal-type.exception';

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
export const NType = <Name extends string>(options: {
  name: Name;
  validator?: Constructor<ValidatorConstraintInterface>;
}) => {
  abstract class NominalTypeClass {
    public static readonly apiPropertyOptions: ApiPropertyOptions = { type: String, example: 'string' };

    /**
     * Property used to make incompatible different types
     * @internal
     */
    readonly #_nominalType: Name;

    /**
     * Constructs a new instance of the nominal type.
     *
     * @param value - The value for the nominal type.
     */
    public constructor(public readonly value: any) {}

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
          return 'varchar';
        }

        public convertToDatabaseValue(
          value: NominalTypeClass,
          platform: Platform,
          context?: TransformContext | boolean,
        ): string {
          if (value === null || value.value === null) return null;

          return value.value;
        }

        public convertToJSValue(value: string, platform: Platform) {
          if (value === 'NULL') return null;
          // todo: find how avoid this
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          return new self(value); // todo: add validation
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

      throw new NominalTypeException(`${this.name} does not have a validator defined`);
    }

    /**
     * Basic implementation of resource decorator. Can be inherited
     */
    public static getResourceDecorators(...args: any[]) {
      return applyDecorators(
        IsObject(),
        ApiProperty(this.apiPropertyOptions),
        Validate(this.getValidator()),
        Transform(
          ({ obj, key }) => {
            const value = obj[key];

            if (value instanceof this) return value;
            if (value === null) return null;

            // @ts-ignore
            return new this(value);
          },
          { toClassOnly: true },
        ),
        Transform(
          ({ key, obj }) => {
            const value = obj[key];

            if (value === null) return null;
            if (value instanceof this) return value.toString();

            return value;
          },
          { toPlainOnly: true },
        ),
      );
    }

    /**
     * Get pipe for NestJS to convert incoming params into class instantly
     */
    public static getPipe(): PipeTransform<any, typeof this> {
      const self = this;

      return new (class implements PipeTransform<any, typeof self> {
        public transform(value: string, metadata: ArgumentMetadata): any {
          const validator = new (self.getValidator())();
          const isValid = validator.validate(value);

          if (!isValid) throw new BadRequestException(validator.defaultMessage());

          // Dynamically create an instance of the class
          const ConcreteClass = self as unknown as new (...args: any[]) => NominalTypeClass;

          return new ConcreteClass(value);
        }
      })();
    }

    public static createInstance<T extends NominalTypeClass>(this: new (...args: any[]) => T, ...args: any[]): T {
      return new this(...args);
    }

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
  }

  return NominalTypeClass;
};
