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

import { createArrayValue } from './array';
import { createBooleanValue } from './boolean';
import { createFunctionValue } from './function';
import { createLeftHandSideValue, createArrayElementLeftHandSideValue, createObjectPropertyLeftHandSideValue } from './left-hand-side';
import {
  createNativeFunctionValue,
  nativeFunctionParameter,
  requiredParameterF,
  requiredNumericParameterF,
  requiredStringParameterF,
  requiredArrayParameterF,
  requiredObjectParameterF,
  optionalParameterF,
  optionalNumericParameterF,
  optionalStringParameterF,
  toNativeNumber,
  toNativeString,
  toNativeBoolean,
  toArray,
  toObject,
  toNumericResult,
  toStringResult,
  toBooleanResult,
  toArrayResult,
  toUndefinedResult,
} from './native-function';
import { createNumericValue } from './numeric';
import { createObjectValue } from './object';
import { createArraySpread, createObjectSpread, createTableSpread } from './spread';
import { createStringValue } from './string';
import { createTableValue } from './table';
import { createUndefined } from './undefined';
import {
  isArray,
  isArraySpread,
  isBoolean,
  isFunction,
  isLeftHandSide,
  isNumber,
  isObject,
  isObjectSpread,
  isString,
  isTable,
  isTableSpread,
  isUndefined,
  isCallable,
} from './types';

export {
  createArrayValue,
  createBooleanValue,
  createFunctionValue,
  createLeftHandSideValue,
  createArrayElementLeftHandSideValue,
  createObjectPropertyLeftHandSideValue,
  createNativeFunctionValue,
  createNumericValue,
  createObjectValue,
  createArraySpread,
  createObjectSpread,
  createTableSpread,
  createStringValue,
  createTableValue,
  createUndefined,
  isArray,
  isArraySpread,
  isBoolean,
  isFunction,
  isLeftHandSide,
  isNumber,
  isObject,
  isObjectSpread,
  isString,
  isTable,
  isTableSpread,
  isUndefined,
  isCallable,

  nativeFunctionParameter,
  requiredParameterF,
  requiredNumericParameterF,
  requiredStringParameterF,
  requiredArrayParameterF,
  requiredObjectParameterF,
  optionalParameterF,
  optionalNumericParameterF,
  optionalStringParameterF,
  toNativeNumber,
  toNativeString,
  toNativeBoolean,
  toArray,
  toObject,
  toNumericResult,
  toStringResult,
  toBooleanResult,
  toArrayResult,
  toUndefinedResult,
};
