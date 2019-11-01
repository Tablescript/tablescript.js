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

import {
  createNativeFunctionValue,
  toBooleanResult,
  isBoolean,
  isNumber,
  isString,
  isObject,
  isArray,
  isFunction,
  isTable,
  isUndefined,
  isCallable,
} from '../values';

export const isBooleanBuiltIn = createNativeFunctionValue(
  'isBoolean',
  ['b'],
  (context, args, b) => isBoolean(b),
  toBooleanResult,
);

export const isNumberBuiltIn = createNativeFunctionValue(
  'isNumber',
  ['n'],
  (context, args, n) => isNumber(n),
  toBooleanResult,
);

export const isStringBuiltIn = createNativeFunctionValue(
  'isString',
  ['s'],
  (context, args, s) => isString(s),
  toBooleanResult,
);

export const isObjectBuiltIn = createNativeFunctionValue(
  'isObject',
  ['o'],
  (context, args, o) => isObject(o),
  toBooleanResult,
);

export const isArrayBuiltIn = createNativeFunctionValue(
  'isArray',
  ['a'],
  (context, args, a) => isArray(a),
  toBooleanResult,
);

export const isFunctionBuiltIn = createNativeFunctionValue(
  'isFunction',
  ['f'],
  (context, args, f) => isFunction(f),
  toBooleanResult,
);

export const isTableBuiltIn = createNativeFunctionValue(
  'isTable',
  ['t'],
  (context, args, t) => isTable(t),
  toBooleanResult,
);

export const isUndefinedBuiltIn = createNativeFunctionValue(
  'isUndefined',
  ['u'],
  (context, args, u) => isUndefined(u),
  toBooleanResult,
);

export const isCallableBuiltIn = createNativeFunctionValue(
  'isCallable',
  ['c'],
  (context, args, c) => isCallable(c),
  toBooleanResult,
);
