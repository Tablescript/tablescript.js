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

import R from 'ramda';
import { createValue } from './default';
import { valueTypes, isNumber, isString } from './types';
import { createStringValue } from './string';
import { createBooleanValue } from './boolean';
import { throwRuntimeError } from '../error';

const asNativeNumber = value => () => value;
const asNativeString = value => () => value.toString();
const asNativeBoolean = value => () => value == 0 ? false : true;
const nativeEquals = value => (context, other) => isNumber(other) && value === other.asNativeNumber(context);
const asNumber = value => context => createNumericValue(value);
const asString = asNativeString => context => createStringValue(asNativeString(context));
const asBoolean = asNativeBoolean => context => createBooleanValue(asNativeBoolean(context));
const add = value => (context, other) => {
  if (isString(other)) {
    return createStringValue(value.toString() + other.asNativeString());
  }
  return createNumericValue(value + other.asNativeNumber(context));
};
const subtract = value => (context, other) => {
  return createNumericValue(value - other.asNativeNumber(context));
};
const multiplyBy = value => (context, other) => {
  return createNumericValue(value * other.asNativeNumber(context));
};
const divideBy = value => (context, other) => {
  if (other.asNativeNumber(context) === 0) {
    throwRuntimeError('Divide by zero', context);
  }
  return createNumericValue(value / other.asNativeNumber(context));
};
const modulo = value => (context, other) => {
  if (other.asNativeNumber(context) === 0) {
    throwRuntimeError('Divide by zero', context);
  }
  return createNumericValue(value % other.asNativeNumber(context));
};
const equals = nativeEquals => (context, other) => createBooleanValue(nativeEquals(context, other));
const notEquals = nativeEquals => (context, other) => createBooleanValue(!nativeEquals(context, other));
const lessThan = value => (context, other) => {
  return createBooleanValue(value < other.asNativeNumber(context));
};
const greaterThan = value => (context, other) => {
  return createBooleanValue(value > other.asNativeNumber(context));
};
const lessThanOrEquals = greaterThan => (context, other) => createBooleanValue(!greaterThan(context, other));
const greaterThanOrEquals = lessThan => (context, other) => createBooleanValue(!lessThan(context, other));

const methods = {
  asNativeNumber,
  asNativeString,
  asNativeBoolean,
  nativeEquals,
  asNumber,
  asString: R.pipe(asNativeString, asString),
  asBoolean: R.pipe(asNativeBoolean, asBoolean),
  add,
  subtract,
  multiplyBy,
  divideBy,
  modulo,
  equals: R.pipe(nativeEquals, equals),
  notEquals: R.pipe(nativeEquals, notEquals),
  lessThan,
  greaterThan,
  lessThanOrEquals: R.pipe(greaterThan, lessThanOrEquals),
  greaterThanOrEquals: R.pipe(lessThan, greaterThanOrEquals),
};

const allMethods = value => Object.keys(methods).reduce((acc, m) => ({ ...acc, [m]: methods[m](value) }), {});

export const createCustomNumericValue = (value, methods) => createValue(
  valueTypes.NUMBER,
  asNativeNumber(value),
  [],
  methods,
);

export const createNumericValue = value => createCustomNumericValue(value, allMethods(value));
