import { t } from '@mikro-orm/core';
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { v4 } from 'uuid';
import { NType } from '../n-type';

@ValidatorConstraint({ name: UUIDValidator.name, async: false })
class UUIDValidator implements ValidatorConstraintInterface {
  public validate(value: any) {
    const uuidRegExp = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegExp.test(value);
  }

  public defaultMessage() {
    return 'Invalid UUID format.';
  }
}

/**
 * Represents a UUID value.
 *
 * @class
 * @extends NType
 */
export class UUID extends NType({
  name: 'uuid',
  validator: UUIDValidator,
}) {
  public _nominalType = UUID.name;

  public static getOrmType() {
    return t.uuid;
  }

  /**
   * Generates a new UUID instance with a random value.
   *
   * @returns {UUID} A new UUID instance with a random value.
   */
  public static generate() {
    return new UUID(v4());
  }

  /**
   * Checks whether the given UUID is identical to the UUID stored in this instance.
   *
   * @param {UUID} other - The UUID to compare with the UUID stored in this instance.
   * @returns {boolean} `true` if the UUIDs are identical, otherwise `false`.
   */
  public isIdentical(other: UUID) {
    return this.value === other.value;
  }

  /**
   * Returns the UUID value formatted as a URL-friendly string without dashes.
   *
   * @returns {string} The UUID value formatted as a URL-friendly string without dashes.
   */
  public toUrlFormat() {
    return this.value.replace(/-/g, '');
  }
}
