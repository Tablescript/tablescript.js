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

import { throwRuntimeError } from '../error';
import {
  isString,
  isNumber,
  isBoolean,
  createNativeFunctionValue,
  toNumericResult,
  toBooleanResult,
  toStringResult
} from '../values';

export const strBuiltIn = createNativeFunctionValue(
  'str',
  ['s'],
  (context, args, s) => s.asNativeString(),
  toStringResult,
);

export const intBuiltIn = createNativeFunctionValue(
  'int',
  ['i'],
  (context, args, i) => {
    if (isNumber(i)) {
      return Math.floor(i.asNativeValue());
    }
    if (isString(i)) {
      const value = parseInt(i.asNativeString(), 10);
      if (isNaN(value)) {
        throwRuntimeError(`Cannot convert ${i.asNativeString()} to NUMBER`);
      }
      return value;
    }
    if (isBoolean(i)) {
      return i.asNativeBoolean() ? 1 : 0;
    }
    throwRuntimeError(`Cannot convert ${i.type} to NUMBER`);
  },
  toNumericResult,
);

export const floatBuiltIn = createNativeFunctionValue(
  'float',
  ['f'],
  (context, args, i) => {
    if (isNumber(i)) {
      return i.asNativeNumber();
    }
    if (isString(i)) {
      const value = parseFloat(i.asNativeString());
      if (isNaN(value)) {
        throwRuntimeError(`Cannot convert ${i.asNativeString()} to NUMBER`);
      }
      return value;
    }
    if (isBoolean(i)) {
      return i.asNativeBoolean() ? 1.0 : 0.0;
    }
    throwRuntimeError(`Cannot convert ${i.type} to NUMBER`);
  },
  toNumericResult,
);

export const boolBuiltIn = createNativeFunctionValue(
  'bool',
  ['b'],
  (context, args, b) => b.asNativeBoolean(),
  toBooleanResult,
);
