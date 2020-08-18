import { registerDecorator } from 'class-validator';
import { pipe, keys, map, toUpper, hasPath, allPass, toLower } from 'ramda';

// A custom DTO validator that is used to enforce operators
// like the gt, gte, lt, lte, eq, and not operator keys on DTOs
export function IsValidOperators(validationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'IsKeyInEnum',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value) {
          const hasAllKeyPaths = pipe(
            keys,
            map(toUpper),
            map(propertyKey => hasPath([propertyKey])),
          )(value);

          return allPass(hasAllKeyPaths)(validationOptions);
        },

        defaultMessage() {
          const enumKeys = pipe(keys, map(toLower))(validationOptions);
          return `operator must be one of [${enumKeys}]`;
        },
      },
    });
  };
}
