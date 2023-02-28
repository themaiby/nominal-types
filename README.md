# Nominal Types

This library provides nominal types for TypeScript, allowing you to enforce type safety and domain-specific constraints
on your data.

Nominal types are a way of enforcing type safety and domain-specific constraints in TypeScript. They work by creating
new types that are distinct from other types, even if they have the same underlying structure. For example, you might
have two different types that are both based on strings, but one is a first name and the other is a last name. By using
nominal types, you can ensure that you don't accidentally mix up the two types.

This library provides a set of commonly used nominal types, along with validation logic to ensure that the data you
receive meets your domain-specific constraints. You can also create your own custom nominal types using the provided
base class.

## Installation

To use this library in your TypeScript project, you can install it via NPM:

```shell
npm install @horizon-republic/nominal-types
```

## Usage

To use a nominal type in your TypeScript code, you first import it from the library:

```ts
import { Text } from "@horizon-republic/nominal-types";
```

You can then create an instance of the type by passing a value to its constructor:

```ts
const myText = new Text("Hello, world!");
```

This will create a new instance of the Text type with the value "Hello, world!". You can then use this instance as you
would any other value of the same type:

```ts
console.log(myText); // Text { value: 'Hello, world!' }
```

## Type Checking

One of the main benefits of nominal types is that they provide extra type safety. TypeScript will treat two different
nominal types as distinct, even if they have the same underlying structure. This means that you can catch type errors at
compile-time, rather than at runtime.

For example, if you have two nominal types FirstName and LastName, TypeScript will treat them as distinct types, even if
they are both based on strings. This means that you can't accidentally assign a FirstName to a variable of type
LastName, or vice versa.

```ts
import { FirstName, LastName } from "@horizon-republic/nominal-types";

const myFirstName = new FirstName("John");
const myLastName = new LastName("Doe");

// This will cause a compile-time error
const myNewLastName: LastName = myFirstName;
```

## Domain-Specific Validation

In addition to providing type safety, nominal types can also be used to enforce domain-specific constraints on your
data. This library provides a set of commonly used nominal types, along with validation logic to ensure that the data
you receive meets your domain-specific constraints.

For example, the Email type enforces that the value it contains is a valid email address:

```ts
import { Email } from "@horizon-republic/nominal-types";

const myEmail = new Email("john.doe@example.com");

// This will cause a runtime error
const myInvalidEmail = new Email("not an email");
```

## Mikro-ORM integration

### Define entity and set type in decorator

```typescript
import { Firstname, UUID } from "@horizon-republic/nominal-types";
import { PrimaryKey, Property } from "@mikro-orm/core";

export class User {
  @PrimaryKey({ type: UUID.getOrmType() })
  public id: UUID;

  @Property({ type: Firstname.getOrmType() })
  public firstName: Firstname;
}
```

## Class-validator integration

Nominal type will automatically add

### For resource class:

```typescript
export class UserResource {
  @Expose()
  @Firstname.getResponseDecorators("id")
  public id: UUID;

  @Expose()
  @Firstname.getResponseDecorators("firstName")
  public firstName: Firstname;
}
```

### For request class:

```typescript
export class UserCreateRequest {
  @IsNotEmpty()
  @Firstname.getRequestDecorators()
  public readonly firstName: Firstname;

  @IsNotEmpty()
  @Lastname.getRequestDecorators()
  public readonly lastName: Lastname;
}
```

## Custom types

You can also create custom nominal types using the NType function. Here's an example of how to create a custom type for
a 24-hour time string:

```ts
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { NType } from "@horizon-republic/nominal-types";

@ValidatorConstraint({ name: Time24Validator.name, async: false })
class Time24Validator implements ValidatorConstraintInterface {
  public validate(value: any): boolean {
    const time24Regex = /^(0?[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
    return time24Regex.test(value);
  }

  public defaultMessage(): string {
    return "Time is invalid. It should be in the 24-hour format, e.g. '12:30'.";
  }
}

/**
 * Represents a time value in 24-hour format.
 *
 * @class
 * @extends NType
 */
export class Time24 extends NType({
  name: "time24",
  validator: Time24Validator,
}) {
  protected _nominalType = Time24.name;

  /**
   * Returns the hour component of the time.
   *
   * @returns {number} The hour component of the time.
   */
  public getHour() {
    return parseInt(this.value.split(":")[0], 10);
  }

  /**
   * Returns the minute component of the time.
   *
   * @returns {number} The minute component of the time.
   */
  public getMinute() {
    return parseInt(this.value.split(":")[1], 10);
  }

  /**
   * Returns the time as a string in the format "HH:MM".
   *
   * @returns {string} The time as a string in the format "HH:MM".
   */
  public toString() {
    return this.value;
  }
}
```

To set `value` type just change it child constructor:

```typescript
class Type extends NType() {
  public constructor(public value: string) {
    super(value);
  }

  /** OR */

  public constructor(public value: boolean) {
    super(value);
  }

  /** OR */

  public constructor(public value: number) {
    super(value);
  }
}
```

Theoretically, more than just a primitive type can be used in `value` property.
But I don't see the point in using objects since the nominal type is already an object.
In any case you will most likely have to override all methods of the child class in order for the objects to work.

## Available Types

This library provides the following nominal types:

- CountryCode2
- CountryCode3
- CountryName
- CountryNumber
- Email
- Firstname
- Lastname
- PhoneNumber
- URL
- UUID

## ToDo

- Typings with class generic
- Separate to modules
- Additional types
