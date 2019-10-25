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

import { createValue } from './default';
import { valueTypes, isNumber, isString } from './types';
import { throwRuntimeError } from '../error';

const asNativeNumber = value => () => value;

const asNativeString = value => () => value.toString();

const asNativeBoolean = value => () => value == 0 ? false : true;

const nativeEquals = value => other => isNumber(other) && value === other.asNativeNumber();

const add = value => (context, other) => {
  if (isString(other)) {
    return context.factory.createStringValue(`${ value }${ other.asNativeString() }`);
  }
  return createNumericValue(value + other.asNativeNumber());
};

const subtract = value => (context, other) => createNumericValue(value - other.asNativeNumber());

const multiplyBy = value => (context, other) => createNumericValue(value * other.asNativeNumber());

const divideBy = value => (context, other) => {
  if (other.asNativeNumber() === 0) {
    throwRuntimeError('Divide by zero', context);
  }
  return createNumericValue(value / other.asNativeNumber());
};

const modulo = value => (context, other) => {
  if (other.asNativeNumber() === 0) {
    throwRuntimeError('Divide by zero', context);
  }
  return createNumericValue(value % other.asNativeNumber());
};

const lessThan = value => (context, other) => context.factory.createBooleanValue(value < other.asNativeNumber());

const greaterThan = value => (context, other) => context.factory.createBooleanValue(value > other.asNativeNumber());

const lessThanOrEquals = value => (context, other) => context.factory.createBooleanValue(value <= other.asNativeNumber());

const greaterThanOrEquals = value => (context, other) => context.factory.createBooleanValue(value >= other.asNativeNumber());

export const createNumericValue = value => createValue(
  valueTypes.NUMBER,
  asNativeNumber(value),
  nativeEquals(value),
  nativeEquals(value),
  {},
  {
    asNativeNumber: asNativeNumber(value),
    asNativeString: asNativeString(value),
    asNativeBoolean: asNativeBoolean(value),
    add: add(value),
    subtract: subtract(value),
    multiplyBy: multiplyBy(value),
    divideBy: divideBy(value),
    modulo: modulo(value),
    lessThan: lessThan(value),
    greaterThan: greaterThan(value),
    lessThanOrEquals: lessThanOrEquals(value),
    greaterThanOrEquals: greaterThanOrEquals(value),
    compare: subtract(value),
  },
);
