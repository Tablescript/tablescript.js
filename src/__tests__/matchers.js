import { isUndefined, isArray, isString, isNumber, isBoolean } from '../values/types';

const toBeTsUndefined = (received) => {
  if (isUndefined(received)) {
    return {
      message: () => `Expected ${received.typeName} not to be UNDEFINED`,
      pass: true,
    };
  } else {
    return {
      message: () => `Expected ${received.typeName} to be UNDEFINED`,
      pass: false,
    };
  }
};

const toBeTsArray = (received) => {
  if (isArray(received)) {
    return {
      message: () => `Expected ${received.typeName} not to be ARRAY`,
      pass: true,
    };
  } else {
    return {
      message: () => `Expected ${received.typeName} to be ARRAY`,
      pass: false,
    };
  }
};

const toBeTsString = (received) => {
  if (isString(received)) {
    return {
      message: () => `Expected ${received.typeName} not to be STRING`,
      pass: true,
    };
  } else {
    return {
      message: () => `Expected ${received.typeName} to be STRING`,
      pass: false,
    };
  }
};

const toBeTsBoolean = (received) => {
  if (isBoolean(received)) {
    return {
      message: () => `expected ${received.typeName}) not to be BOOLEAN`,
      pass: true,
    };
  } else {
    return {
      message: () => `expected ${received.typeName}) to be BOOLEAN`,
      pass: false,
    };
  }
};

const toEqualTsString = (received, s) => {
  if (isString(received) && received.asNativeString() === s) {
    return {
      message: () => `Expected STRING "${s}" and got ${received.typeName} "${received.asNativeString()}"`,
      pass: true,
    };
  } else {
    return {
      message: () => `Expected STRING "${s}" but got ${received.typeName} "${received.asNativeString()}"`,
      pass: false,
    };
  }
};

const toEqualTsNumber = (received, n) => {
  if (isNumber(received) && received.asNativeNumber() === n) {
    return {
      message: () => `Expected NUMBER ${n} and got ${received.typeName} ${received.asNativeNumber()}`,
      pass: true,
    };
  } else {
    return {
      message: () => `Expected NUMBER ${n} but got ${received.typeName} ${received.asNativeNumber()}`,
      pass: false,
    };
  }
};

const toEqualTsBoolean = (received, b) => {
  if (isBoolean(received) && received.asNativeValue() === b) {
    return {
      message: () =>
        `expected BOOLEAN ${b} not to be ${received.asNativeValue()}`,
      pass: true,
    };
  } else {
    return {
      message: () =>
        `expected BOOLEAN ${b} but got ${received.typeName} ${received.asNativeValue()}`,
      pass: false,
    };
  }
};

expect.extend({
  toBeTsBoolean,
  toBeTsString,
  toBeTsArray,
  toBeTsUndefined,
  toEqualTsBoolean,
  toEqualTsNumber,
  toEqualTsString,
});
