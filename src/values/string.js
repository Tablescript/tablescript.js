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
import { valueTypes, isString, isUndefined } from './types';
import { createNativeFunctionValue } from './function';
import { throwRuntimeError } from '../error';
import { requiredParameter, optionalParameter } from '../util/parameters';
import { rollDiceFromString } from '../util/dice-strings';
import {
  withRequiredParameter,
  withRequiredNumericParameter,
  withOptionalParameter,
  withOptionalNumericParameter,
  withArrayResult,
  withStringResult,
  withBooleanResult,
  withNumericResult,
} from './util/methods';

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
  ['separator'],
  R.compose(
    withArrayResult,
    withOptionalParameter('separator'),
  )(
    (context, separator) => (separator ? (
      value.split(separator.asNativeString()).map(createStringValue)
    ) : (
      value.split().map(createStringValue)
    )),
  ),
);

const capitalize = value => createNativeFunctionValue(
  [],
  withStringResult(
    context => (value.length === 0 ? value : `${ value[0].toUpperCase() }${ value.slice(1) }`)
  ),
);

const uppercase = value => createNativeFunctionValue(
  [],
  withStringResult(R.always(value.toUpperCase())),
);

const lowercase = value => createNativeFunctionValue(
  [],
  withStringResult(R.always(value.toLowerCase())),
);

const includes = value => createNativeFunctionValue(
  ['s'],
  R.compose(
    withBooleanResult,
    withRequiredParameter('s'),
  )(
    (context, s) => value.includes(s.asNativeString()),
  ),
);

const indexOf = value => createNativeFunctionValue(
  ['s'],
  R.compose(
    withNumericResult,
    withRequiredParameter('s'),
  )(
    (context, s) => value.indexOf(s.asNativeString()),
  ),
);

const slice = value => createNativeFunctionValue(
  ['start', 'end'],
  R.compose(
    withStringResult,
    withOptionalNumericParameter('end', 'slice(start, end) end'),
    withRequiredNumericParameter('start', 'slice(start, end) start'),
  )(
    (context, startValue, endValue) => (isUndefined(endValue) ? (
      value.slice(startValue.asNativeNumber())
    ) : (
      value.slice(startValue.asNativeNumber(), endValue.asNativeNumber())
    )),
  ),
);

const startsWith = value => createNativeFunctionValue(
  ['s'],
  R.compose(
    withBooleanResult,
    withRequiredParameter('s'),
  )(
    (context, s) => value.startsWith(s.asNativeString()),
  ),
);

const endsWith = value => createNativeFunctionValue(
  ['s'],
  R.compose(
    withBooleanResult,
    withRequiredParameter('s'),
  )(
    (context, s) => value.endsWith(s.asNativeString()),
  ),
);

const trim = value => createNativeFunctionValue(
  [],
  withStringResult(
    R.always(value.trim()),
  ),
);

const trimLeft = value => createNativeFunctionValue(
  [],
  withStringResult(
    R.always(value.trimLeft()),
  ),
);

const trimRight = value => createNativeFunctionValue(
  [],
  withStringResult(
    R.always(value.trimRight()),
  ),
);

const empty = value => createNativeFunctionValue(
  [],
  withBooleanResult(
    R.always(value.length === 0),
  ),
);

const length = value => createNativeFunctionValue(
  [],
  withNumericResult(
    R.always(value.length),
  ),
);

const roll = value => createNativeFunctionValue(
  [],
  withNumericResult(
    context => {
      try {
        return rollDiceFromString(value);
      } catch (e) {
        throwRuntimeError(e.message, context);
      }
    },
  ),
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
