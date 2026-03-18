const returnValue = <T>(value: T) => value;

const message = returnValue<string>("Hello world");

const count = returnValue<number>(5);