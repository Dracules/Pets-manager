import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: false })
class IsBirthDateRealisticConstraint implements ValidatorConstraintInterface {
  validate(date: Date, args: ValidationArguments) {
    if (!(date instanceof Date) || isNaN(date.getTime())) return false;
    const maxYears = args.constraints[0] as number;

    const now = new Date();
    if (maxYears) {
      const minDate = new Date();
      minDate.setFullYear(now.getFullYear() - maxYears);

      return date >= minDate && date <= now;
    }
    return date <= now;
  }

  defaultMessage(args: ValidationArguments) {
    if (args.constraints[0])
      return `The date must be within the last ${args.constraints[0]} years and no later than today.`;
    else return `The date must be no later than today.`;
  }
}

export function IsBirthDateRealistic(
  years?: number,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [years],
      validator: IsBirthDateRealisticConstraint,
    });
  };
}
