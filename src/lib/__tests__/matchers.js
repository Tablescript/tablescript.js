// Copyright 2019 Jamie Hale
//
// This file is part of Tablescript.js.
//
// Tablescript.js is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Tablescript.js is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Tablescript.js. If not, see <http://www.gnu.org/licenses/>.

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
