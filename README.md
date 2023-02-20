# Nominal Types

This package provides a factory for building nominal types in TypeScript. Nominal types are a way of creating distinct
types with the same underlying type, for example to distinguish between two strings that have different meanings.

## Usage

### Create a Nominal Type

To create a nominal type, use the `NType` factory:

```ts
import { NType } from "nominal-types";

const MyNominalType = NType({ name: "my-nominal-type" });
```

This creates a new nominal type called `MyNominalType`. You can now use this type like any other type:

```ts
function doSomethingWithMyNominalType(value: MyNominalType) {
  // ...
}
```

### Using a Validator

You can add a validator to your nominal type by passing a class that implements `ValidatorConstraintInterface` to
the `validator` option of the `NType` factory:

```ts
import { ValidatorConstraintInterface } from "class-validator";
import { NType } from "nominal-types";

class MyValidator implements ValidatorConstraintInterface {
  public validate(value: any) {
    return value === "valid";
  }
}

const MyNominalType = NType({
  name: "my-nominal-type",
  validator: MyValidator,
});
```

### Example Usage

```ts
import { IsDefined } from "class-validator";
import { NType } from "nominal-types";

class UsernameValidator implements ValidatorConstraintInterface {
  public validate(value: any) {
    const usernameRegex = /^[a-zA-Z0-9]{4,20}$/;
    return usernameRegex.test(value);
  }

  public defaultMessage() {
    return "Username must be between 4 and 20 characters and can only contain letters and numbers.";
  }
}

export class Username extends NType({
  name: "username",
  validator: IsDefined,
}) {
  protected _nominalType = Username.name;

  public isJohn(value: string) {
    return value === "John";
  }
}
```

## License

MIT License
