import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { NType } from '../n-type';

@ValidatorConstraint({ name: LastNameValidator.name, async: false })
class LastNameValidator implements ValidatorConstraintInterface {
  public validate(value: any, validationArguments?: ValidationArguments) {
    const nameRegex = /^[A-Za-z]{2,}$/;
    return nameRegex.test(value);
  }

  public defaultMessage(validationArguments?: ValidationArguments) {
    return `${validationArguments.property}: ${
      validationArguments?.value ?? 'Specified value'
    } is not a valid last name.`;
  }
}

export class LastName extends NType({
  name: 'last-name',
  validator: LastNameValidator,
}) {
  public _nominalType = LastName.name;
}
