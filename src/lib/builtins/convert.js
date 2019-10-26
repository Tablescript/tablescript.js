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
  nativeFunctionParameter,
  requiredParameterF,
  toNumericResult
} from '../values';

export const strBuiltIn = createNativeFunctionValue(
  'str',
  [
    nativeFunctionParameter('s', requiredParameterF()),
  ],
  (context, args, s) => {
    if (isString(s)) {
      return s;
    }
    return context.factory.createStringValue(s.asNativeString());
  },
);

export const intBuiltIn = createNativeFunctionValue(
  'int',
  [
    nativeFunctionParameter('i', requiredParameterF()),
  ],
  (context, args, i) => {
    if (isNumber(i)) {
      return Math.round(i.asNativeValue());
    }
    if (isString(i)) {
      const value = parseInt(i.asNativeString(), 10);
      if (isNaN(value)) {
        throwRuntimeError(`Cannot convert ${i.type} to NUMBER`);
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
