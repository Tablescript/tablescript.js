// Copyright 2017 Jamie Hale
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

import { throwRuntimeError } from '../error';
import { defaultValue } from './default';
import { valueTypes, isString } from './types';
import { createBooleanValue } from './boolean';
import { createNumericValue } from './numeric';
import { createUndefined } from './undefined';
import { createArrayValue } from './array';
import { createNativeFunctionValue } from './function';

export const createStringValue = value => {
  const asNativeString = () => value;
  const asNativeBoolean = () => value === '' ? false : true;
  const nativeEquals = (context, other) => isString(other) && value === other.asNativeString(context);
  const asString = context => createStringValue(asNativeString(context));
  const asBoolean = context => createBooleanValue(asNativeBoolean(context));
  const getProperty = (context, name) => {
    const nameValue = name.asNativeString(context);
    if (members[nameValue]) {
      return members[nameValue];
    }
    throwRuntimeError(`String has no member ${nameValue}`, context);
  };
  const getElement = (context, index) => {
    let indexValue = index.asNativeNumber(context);
    if (indexValue < 0) {
      indexValue = value.length + indexValue;
    }
    if (indexValue < 0 || indexValue >= value.length) {
      return createUndefined();
    }
    return createStringValue(value[indexValue]);
  };

  const split = createNativeFunctionValue(['separator'], (context, scope) => {
    const separator = scope['separator'];
    if (separator) {
      if (separator.type !== valueTypes.STRING) {
        throwRuntimeError(`split(separator) separator must be a string`, context);
      }
      return createArrayValue(value.split(separator.asNativeString(context)).map(s => createStringValue(s)));
    }
    return createArrayValue(value.split().map(s => createStringValue(s)));
  });

  const capitalize = createNativeFunctionValue([], (context, scope) => {
    return createStringValue(value[0].toUpperCase() + value.slice(1));
  });

  const uppercase = createNativeFunctionValue([], (context, scope) => {
    return createStringValue(value.toUpperCase());
  });

  const lowercase = createNativeFunctionValue([], (context, scope) => {
    return createStringValue(value.toLowerCase());
  });

  const includes = createNativeFunctionValue(['s'], (context, scope) => {
    const s = scope['s'];
    if (s.type !== valueTypes.STRING) {
      throwRuntimeError(`includes(s) s must be a string`, context);
    }
    return createBooleanValue(value.includes(s.asNativeString(context)));
  });

  const indexOf = createNativeFunctionValue(['s'], (context, scope) => {
    const s = scope['s'];
    if (s.type !== valueTypes.STRING) {
      throwRuntimeError(`indexOf(s) s must be a string`, context);
    }
    return createNumericValue(value.indexOf(s.asNativeString(context)));
  });

  const startsWith = createNativeFunctionValue(['s'], (context, scope) => {
    const s = scope['s'];
    if (s.type !== valueTypes.STRING) {
      throwRuntimeError(`startsWith(s) s must be a string`, context);
    }
    return createBooleanValue(value.startsWith(s.asNativeString(context)));
  });

  const endsWith = createNativeFunctionValue(['s'], (context, scope) => {
    const s = scope['s'];
    if (s.type !== valueTypes.STRING) {
      throwRuntimeError(`endsWith(s) s must be a string`, context);
    }
    return createBooleanValue(value.endsWith(s.asNativeString(context)));
  });

  const trim = createNativeFunctionValue([], (context, scope) => {
    return createStringValue(value.trim());
  });

  const trimLeft = createNativeFunctionValue([], (context, scope) => {
    return createStringValue(value.trimLeft());
  });

  const trimRight = createNativeFunctionValue([], (context, scope) => {
    return createStringValue(value.trimRight());
  });

  const slice = createNativeFunctionValue(['start', 'end'], (context, scope) => {
    const startValue = scope['start'];
    const endValue = scope['end'];
    if (endValue) {
      return createStringValue(value.slice(startValue.asNativeNumber(context), endValue.asNativeNumber(context)));
    }
    return createStringValue(value.slice(startValue.asNativeNumber(context)));
  });

  const members = {
    split,
    capitalize,
    uppercase,
    lowercase,
    includes,
    indexOf,
    slice,
    startsWith,
    endsWith,
    trim,
    trimLeft,
    trimRight,
    empty: createBooleanValue(value.length === 0),
    length: createNumericValue(value.length),
  };

  return {
    ...defaultValue(valueTypes.STRING, asNativeString),
    asNativeString,
    asNativeBoolean,
    nativeEquals,
    asString,
    asBoolean,
    getProperty,
    getElement,
    add: (context, otherValue) => {
      return createStringValue(asNativeString(context) + otherValue.asNativeString(context));
    },
    multiplyBy: (context, otherValue) => {
      return createStringValue(asNativeString().repeat(otherValue.asNativeNumber()));
    },
    equals: (context, otherValue) => {
      return createBooleanValue(nativeEquals(context, otherValue));
    },
  };
};
