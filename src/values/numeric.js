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

import { defaultValue } from './default';
import { valueTypes, isNumeric } from './types';
import { createStringValue } from './string';
import { createBooleanValue } from './boolean';
import { throwRuntimeError } from '../error';

export const createNumericValue = value => {
  const asNativeNumber = () => value;
  const asNativeString = () => value.toString();
  const asNativeBoolean = () => value == 0 ? false : true;
  const nativeEquals = (context, other) => isNumeric(other) && value === other.asNativeNumber(context);
  const asNumber = context => createNumericValue(asNativeNumber(context));
  const asString = context => createStringValue(asNativeString(context));
  const asBoolean = context => createBooleanValue(asNativeBoolean(context));
  const add = (context, otherValue) => {
    return createNumericValue(asNativeNumber(context) + otherValue.asNativeNumber(context));
  };
  const subtract = (context, otherValue) => {
    return createNumericValue(asNativeNumber(context) - otherValue.asNativeNumber(context));
  };
  const multiplyBy = (context, otherValue) => {
    return createNumericValue(asNativeNumber(context) * otherValue.asNativeNumber(context));
  };
  const divideBy = (context, otherValue) => {
    if (otherValue.asNativeNumber(context) === 0) {
      throwRuntimeError('Divide by zero', context);
    }
    return createNumericValue(asNativeNumber(context) / otherValue.asNativeNumber(context));
  };
  const modulo = (context, otherValue) => {
    if (otherValue.asNativeNumber(context) === 0) {
      throwRuntimeError('Divide by zero', context);
    }
    return createNumericValue(asNativeNumber(context) % otherValue.asNativeNumber(context));
  };
  const equals = (context, otherValue) => createBooleanValue(nativeEquals(context, otherValue));
  const notEquals = (context, otherValue) => createBooleanValue(!nativeEquals(context, otherValue));
  const lessThan = (context, otherValue) => {
    return createBooleanValue(asNativeNumber(context) < otherValue.asNativeNumber(context));
  };
  const greaterThan = (context, otherValue) => {
    return createBooleanValue(asNativeNumber(context) > otherValue.asNativeNumber(context));
  };
  const lessThanOrEquals = (context, otherValue) => createBooleanValue(!greaterThan(context, otherValue));
  const greaterThanOrEquals = (context, otherValue) => createBooleanValue(!lessThan(context, otherValue));

  return {
    ...defaultValue(valueTypes.NUMBER, asNativeNumber),
    asNativeNumber,
    asNativeString,
    asNativeBoolean,
    nativeEquals,
    asNumber,
    asString,
    asBoolean,
    add,
    subtract,
    multiplyBy,
    divideBy,
    modulo,
    equals,
    notEquals,
    lessThan,
    greaterThan,
    lessThanOrEquals,
    greaterThanOrEquals,
  };
};
