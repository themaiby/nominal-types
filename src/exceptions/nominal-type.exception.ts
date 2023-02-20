export class NominalTypeException extends Error {
  public constructor(public readonly message: string) {
    super(message);
  }
}
