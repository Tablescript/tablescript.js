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
import { valueTypes, isString, isNumber } from './types';
import { createNativeFunctionValue } from './function';
import { throwRuntimeError } from '../error';
import { requiredParameter, optionalParameter } from '../util/parameters';
import { rollDiceFromString } from '../util/random';

const asNativeString = value => () => value;

const asNativeBoolean = value => () => value === '' ? false : true;

const nativeEquals = value => (context, other) => isString(other) && value === other.asNativeString(context);

const getElement = value => (context, index) => {
  let indexValue = index.asNativeNumber(context);
  if (indexValue < 0) {
    indexValue = value.length + indexValue;
  }
  if (indexValue < 0 || indexValue >= value.length) {
    return context.factory.createUndefined();
  }
  return createStringValue(value[indexValue]);
};

const add = asNativeString => (context, other) => createStringValue(asNativeString(context) + other.asNativeString(context));

const multiplyBy = asNativeString => (context, other) => createStringValue(asNativeString(context).repeat(other.asNativeNumber(context)));

const split = value => createNativeFunctionValue(['separator'], async context => {
  const separator = optionalParameter(context, 'separator');
  if (separator) {
    if (!isString(separator)) {
      throwRuntimeError(`split(separator) separator must be a string`, context);
    }
    return context.factory.createArrayValue(value.split(separator.asNativeString(context)).map(s => createStringValue(s)));
  }
  return context.factory.createArrayValue(value.split().map(s => createStringValue(s)));
});

const capitalize = value => createNativeFunctionValue([], async () => createStringValue(value.length === 0 ? value : value[0].toUpperCase() + value.slice(1)));

const uppercase = value => createNativeFunctionValue([], async () => createStringValue(value.toUpperCase()));

const lowercase = value => createNativeFunctionValue([], async () => createStringValue(value.toLowerCase()));

const includes = value => createNativeFunctionValue(['s'], async context => {
  const s = requiredParameter(context, 's');
  if (!isString(s)) {
    throwRuntimeError(`includes(s) s must be a string`, context);
  }
  return context.factory.createBooleanValue(value.includes(s.asNativeString(context)));
});

const indexOf = value => createNativeFunctionValue(['s'], async context => {
  const s = requiredParameter(context, 's');
  if (!isString(s)) {
    throwRuntimeError(`indexOf(s) s must be a string`, context);
  }
  return context.factory.createNumericValue(value.indexOf(s.asNativeString(context)));
});

const slice = value => createNativeFunctionValue(['start', 'end'], async context => {
  const startValue = requiredParameter(context, 'start');
  if (!isNumber(startValue)) {
    throwRuntimeError(`slice(start, end) start must be a number`, context);
  }
  const endValue = optionalParameter(context, 'end');
  if (endValue) {
    if (!isNumber(endValue)) {
      throwRuntimeError(`slice(start, end) end must be a number`, context);
    }
    return createStringValue(value.slice(startValue.asNativeNumber(context), endValue.asNativeNumber(context)));
  }
  return createStringValue(value.slice(startValue.asNativeNumber(context)));
});

const startsWith = value => createNativeFunctionValue(['s'], async context => {
  const s = requiredParameter(context, 's');
  if (!isString(s)) {
    throwRuntimeError(`startsWith(s) s must be a string`, context);
  }
  return context.factory.createBooleanValue(value.startsWith(s.asNativeString(context)));
});

const endsWith = value => createNativeFunctionValue(['s'], async context => {
  const s = requiredParameter(context, 's');
  if (!isString(s)) {
    throwRuntimeError(`endsWith(s) s must be a string`, context);
  }
  return context.factory.createBooleanValue(value.endsWith(s.asNativeString(context)));
});

const trim = value => createNativeFunctionValue([], async () => createStringValue(value.trim()));

const trimLeft = value => createNativeFunctionValue([], async () => createStringValue(value.trimLeft()));

const trimRight = value => createNativeFunctionValue([], async () => createStringValue(value.trimRight()));

const empty = value => createNativeFunctionValue([], async context => context.factory.createBooleanValue(value.length === 0));

const length = value => createNativeFunctionValue([], async context => context.factory.createNumericValue(value.length));

const roll = value => createNativeFunctionValue([], async context => {
  try {
    return context.factory.createNumericValue(rollDiceFromString(value));
  } catch (e) {
    throwRuntimeError(e.message, context);
  }
});

export const createStringValue = value => createValue(
  valueTypes.STRING,
  asNativeString(value),
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
    nativeEquals: nativeEquals(value),
    getElement: getElement(value),
    add: R.pipe(asNativeString, add)(value),
    multiplyBy: R.pipe(asNativeString, multiplyBy)(value),
  },
);
