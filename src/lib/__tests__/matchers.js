import { isUndefined, isArray, isObject, isString, isNumber, isBoolean, isFunction } from '../values/types';

const toBeTsUndefined = received => {
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

const toBeTsArray = received => {
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

const toBeTsObject = received => {
  if (isObject(received)) {
    return {
      message: () => `Expected ${received.typeName} not to be OBJECT`,
      pass: true,
    };
  } else {
    return {
      message: () => `Expected ${received.typeName} to be OBJECT`,
      pass: false,
    };
  }
}

const toBeTsString = received => {
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

const toBeTsBoolean = received => {
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

const toBeTsFunction = received => {
  if (isFunction(received)) {
    return {
      message: () => `expected ${received.typeName}) not to be FUNCTION`,
      pass: true,
    };
  } else {
    return {
      message: () => `expected ${received.typeName}) to be FUNCTION`,
      pass: false,
    };
  }
}

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
        `expected BOOLEAN ${received.asNativeValue()} not to be ${b}`,
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

const toEqualTsArray = (received, a) => {
  if (isArray(received) && received.nativeEquals(a)) {
    return {
      message: () => `expected ARRAY ${received.asNativeString()} not to equal ${a.asNativeString()}`,
      pass: true,
    };
  } else {
    return {
      message: () => `expected ${received.typeName} ${received.asNativeString()} to equal ${a.asNativeString()}`,
      pass: false,
    };
  }
};

expect.extend({
  toBeTsBoolean,
  toBeTsString,
  toBeTsArray,
  toBeTsObject,
  toBeTsUndefined,
  toBeTsFunction,
  toEqualTsBoolean,
  toEqualTsNumber,
  toEqualTsString,
  toEqualTsArray,
});
