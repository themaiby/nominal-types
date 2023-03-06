import { isObject, ValidationArguments as ValidationArgs } from 'class-validator';
import { NType } from './n-type';

type NominalTypeClass = InstanceType<ReturnType<typeof NType>>;

export abstract class NTypeValidator<NominalType extends NominalTypeClass> {
  protected abstract message(validationArguments?: ValidationArgs): string;

  protected abstract rule(
    value: NominalType['value'],
    validationArguments?: ValidationArgs,
  ): Promise<boolean> | boolean;

  /**
   * Overridden to implement additional behaviors
   *
   * @param validationArguments
   */
  public defaultMessage(validationArguments?: ValidationArgs) {
    return this.message(validationArguments);
  }

  /**
   * Overridden to cast class to string if needed
   *
   * @param value
   * @param validationArguments
   */
  public validate(value: any | NominalType, validationArguments?: ValidationArgs): Promise<boolean> | boolean {
    const normalizedValue = isObject(value) ? (value as NominalType).value : value;

    return this.rule(normalizedValue, validationArguments);
  }
}
