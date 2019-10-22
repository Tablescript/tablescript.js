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

import * as R from 'ramda';
import { createValue } from './default';
import { valueTypes, isString } from './types';
import {
  createNativeFunctionValue,
  nativeFunctionParameter,
  requiredNumericParameterF,
  requiredStringParameterF,
  optionalNumericParameterF,
  optionalStringParameterF,
  toNativeNumber,
  toNativeString,
  toArrayResult,
  toStringResult,
  toBooleanResult,
  toNumericResult,
} from './native-function';
import { throwRuntimeError } from '../error';
import { rollDiceFromString } from '../util/dice-strings';

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

const lessThan = value => (context, other) => context.factory.createBooleanValue(value < other.asNativeString());

const greaterThan = value => (context, other) => context.factory.createBooleanValue(value > other.asNativeString());

const lessThanOrEquals = value => (context, other) => context.factory.createBooleanValue(value <= other.asNativeString());

const greaterThanOrEquals = value => (context, other) => context.factory.createBooleanValue(value >= other.asNativeString());

const compare = value => (context, other) => context.factory.createNumericValue(value.localeCompare(other.asNativeString()));

const split = value => createNativeFunctionValue(
  'split',
  [
    nativeFunctionParameter('separator', optionalStringParameterF(toNativeString)),
  ],
  (context, args, separator) => (args.length === 1 ? (
    value.split(separator).map(createStringValue)
  ) : (
    value.split().map(createStringValue)
  )),
  toArrayResult,
);

const capitalize = value => createNativeFunctionValue(
  'capitalize',
  [],
  () => (value.length === 0 ? value : `${ value[0].toUpperCase() }${ value.slice(1) }`),
  toStringResult,
);

const uppercase = value => createNativeFunctionValue(
  'uppercase',
  [],
  R.always(value.toUpperCase()),
  toStringResult,
);

const lowercase = value => createNativeFunctionValue(
  'lowercase',
  [],
  R.always(value.toLowerCase()),
  toStringResult,
);

const includes = value => createNativeFunctionValue(
  'includes',
  [
    nativeFunctionParameter('s', requiredStringParameterF(toNativeString)),
  ],
  (context, args, s) => value.includes(s),
  toBooleanResult,
);

const indexOf = value => createNativeFunctionValue(
  'indexOf',
  [
    nativeFunctionParameter('s', requiredStringParameterF(toNativeString)),
  ],
  (context, args, s) => value.indexOf(s),
  toNumericResult,
);

const slice = value => createNativeFunctionValue(
  'slice',
  [
    nativeFunctionParameter('start', requiredNumericParameterF(toNativeNumber)),
    nativeFunctionParameter('end', optionalNumericParameterF(toNativeNumber)),
  ],
  (context, args, startValue, endValue) => (args.length === 1 ? (
    value.slice(startValue)
  ) : (
    value.slice(startValue, endValue)
  )),
  toStringResult,
);

const startsWith = value => createNativeFunctionValue(
  'startsWith',
  [
    nativeFunctionParameter('s', requiredStringParameterF(toNativeString)),
  ],
  (context, args, s) => value.startsWith(s),
  toBooleanResult,
);

const endsWith = value => createNativeFunctionValue(
  'endsWith',
  [
    nativeFunctionParameter('s', requiredStringParameterF(toNativeString)),
  ],
  (context, args, s) => value.endsWith(s),
  toBooleanResult,
);

const trim = value => createNativeFunctionValue(
  'trim',
  [],
  R.always(value.trim()),
  toStringResult,
);

const trimLeft = value => createNativeFunctionValue(
  'trimLeft',
  [],
  R.always(value.trimLeft()),
  toStringResult,
);

const trimRight = value => createNativeFunctionValue(
  'trimRight',
  [],
  R.always(value.trimRight()),
  toStringResult,
);

const empty = value => createNativeFunctionValue(
  'empty',
  [],
  R.always(value.length === 0),
  toBooleanResult,
);

const length = value => createNativeFunctionValue(
  'length',
  [],
  R.always(value.length),
  toNumericResult,
);

const roll = value => createNativeFunctionValue(
  'roll',
  [],
  context => {
    try {
      return rollDiceFromString(value);
    } catch (e) {
      throwRuntimeError(e.message, context);
    }
  },
  toNumericResult,
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
