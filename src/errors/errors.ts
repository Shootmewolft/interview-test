type ErrorConstructor = new (message: string) => Error;

export function createFactoryError(name: string): ErrorConstructor {
  return class extends Error {
    constructor(message: string) {
      super(message);
      this.name = name;
      Object.setPrototypeOf(this, new.target.prototype);
    }
  };
}
