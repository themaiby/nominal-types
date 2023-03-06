import { ApiPropertyOptions } from '@nestjs/swagger';
import { isEmail, ValidationArguments, ValidatorConstraint } from 'class-validator';
import { NType } from '../n-type';
import { NTypeValidator } from '../n-type.validator';

// @ValidatorConstraint({ name: EmailValidator.name, async: false })
// class EmailValidator implements ValidatorConstraintInterface {
//   public validate(value: string | Email): boolean {
//     return isEmail(String(value));
//   }
//
//   public defaultMessage(validationArguments?: ValidationArguments) {
//     return `${validationArguments.property}: ${
//       validationArguments?.value ?? "Specified value"
//     } is not a valid e-mail.`;
//   }
// }

@ValidatorConstraint({ name: EmailValidator.name, async: false })
class EmailValidator extends NTypeValidator<Email> {
  message(validationArguments: ValidationArguments | undefined): string {
    return `${validationArguments.property}: ${validationArguments?.value ?? 'Specified value'} is not a valid e-mail.`;
  }

  rule(value: Email['value'], validationArguments: ValidationArguments | undefined): Promise<boolean> | boolean {
    return isEmail(value);
  }
}

/**
 * Represents an email address.
 *
 * @class
 * @extends NType
 */
export class Email extends NType({
  name: 'email',
  validator: EmailValidator,
}) {
  public _nominalType = Email.name;

  public static apiPropertyOptions: ApiPropertyOptions = {
    type: String,
    format: 'email',
  };
}
