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
import { valueTypes, isString } from './types';
import {
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
  empty,
  length,
  roll,
} from './string-methods';
import { throwRuntimeError } from '../error';

const identicalTo = value => other => isString(other) && value === other.asNativeString();

const asNativeString = value => () => value;

const asNativeBoolean = value => () => value === '' ? false : true;

const nativeEquals = value => other => value === other.asNativeString();

const getElement = value => (context, index) => {
  let indexValue = index.asNativeNumber();
  if (indexValue < 0) {
    indexValue = value.length + indexValue;
  }
  if (indexValue < 0 || indexValue >= value.length) {
    return context.factory.createUndefined();
  }
  return createStringValue(value[indexValue]);
};

const add = value => (context, other) => createStringValue(`${ value }${ other.asNativeString() }`);

const multiplyBy = value => (context, other) => {
  const count = other.asNativeNumber();
  if (count < 0) {
    throwRuntimeError('string repeat count must be greater than 0', context);
  }
  return createStringValue(value.repeat(count));
};

const locale = context => context.options.values.locale;

const localeOptions = context => ({
  numeric: context.options.values.localeNumeric,
  sensitivity: context.options.values.localeSensitivity,
});

const lessThan = value => (context, other) => context.factory.createBooleanValue(
  value.localeCompare(other.asNativeString(), locale(context), localeOptions(context)) < 0
);

const greaterThan = value => (context, other) => context.factory.createBooleanValue(
  value.localeCompare(other.asNativeString(), locale(context), localeOptions(context)) > 0
);

const lessThanOrEquals = value => (context, other) => context.factory.createBooleanValue(
  value.localeCompare(other.asNativeString(), locale(context), localeOptions(context)) <= 0
);

const greaterThanOrEquals = value => (context, other) => context.factory.createBooleanValue(
  value.localeCompare(other.asNativeString(), locale(context), localeOptions(context)) >= 0
);

const compare = value => (context, other) => context.factory.createNumericValue(
  value.localeCompare(other.asNativeString(), locale(context), localeOptions(context))
);

export const createStringValue = value => createValue(
  valueTypes.STRING,
  asNativeString(value),
  identicalTo(value),
  nativeEquals(value),
  {
    split: split(value),
    capitalize: capitalize(value),
    uppercase: uppercase(value),
    lowercase: lowercase(value),
    includes: includes(value),
    indexOf: indexOf(value),
    slice: slice(value),
    startsWith: startsWith(value),
    endsWith: endsWith(value),
    trim: trim(value),
    trimLeft: trimLeft(value),
    trimRight: trimRight(value),
    empty: empty(value),
    length: length(value),
    roll: roll(value),
  },
  {
    asNativeString: asNativeString(value),
    asNativeBoolean: asNativeBoolean(value),
    getElement: getElement(value),
    add: add(value),
    multiplyBy: multiplyBy(value),
    lessThan: lessThan(value),
    greaterThan: greaterThan(value),
    lessThanOrEquals: lessThanOrEquals(value),
    greaterThanOrEquals: greaterThanOrEquals(value),
    compare: compare(value),
  },
);
