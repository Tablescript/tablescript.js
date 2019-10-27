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
import {
  createNativeFunctionValue,
  toArrayResult,
  toStringResult,
  toBooleanResult,
  toNumericResult,
} from './native-function';
import { throwRuntimeError } from '../error';
import { rollDiceFromString } from '../util/dice-strings';
import { isUndefined } from './types';

export const split = value => createNativeFunctionValue(
  'split',
  ['separator'],
  (context, args, separator) => (isUndefined(separator) ? (
    value.split().map(context.factory.createStringValue)
  ) : (
    value.split(separator.asNativeString()).map(context.factory.createStringValue)
  )),
  toArrayResult,
);

export const capitalize = value => createNativeFunctionValue(
  'capitalize',
  [],
  () => (value.length === 0 ? value : `${ value[0].toUpperCase() }${ value.slice(1) }`),
  toStringResult,
);

export const uppercase = value => createNativeFunctionValue(
  'uppercase',
  [],
  R.always(value.toUpperCase()),
  toStringResult,
);

export const lowercase = value => createNativeFunctionValue(
  'lowercase',
  [],
  R.always(value.toLowerCase()),
  toStringResult,
);

export const includes = value => createNativeFunctionValue(
  'includes',
  ['s'],
  (context, args, s) => value.includes(s.asNativeString()),
  toBooleanResult,
);

export const indexOf = value => createNativeFunctionValue(
  'indexOf',
  ['s'],
  (context, args, s) => value.indexOf(s.asNativeString()),
  toNumericResult,
);

export const slice = value => createNativeFunctionValue(
  'slice',
  ['start', 'end'],
  (context, args, startValue, endValue) => (isUndefined(endValue) ? (
    value.slice(startValue.asNativeNumber())
  ) : (
    value.slice(startValue.asNativeNumber(), endValue.asNativeNumber())
  )),
  toStringResult,
);

export const startsWith = value => createNativeFunctionValue(
  'startsWith',
  ['s'],
  (context, args, s) => value.startsWith(s.asNativeString()),
  toBooleanResult,
);

export const endsWith = value => createNativeFunctionValue(
  'endsWith',
  ['s'],
  (context, args, s) => value.endsWith(s.asNativeString()),
  toBooleanResult,
);

export const trim = value => createNativeFunctionValue(
  'trim',
  [],
  R.always(value.trim()),
  toStringResult,
);

export const trimLeft = value => createNativeFunctionValue(
  'trimLeft',
  [],
  R.always(value.trimLeft()),
  toStringResult,
);

export const trimRight = value => createNativeFunctionValue(
  'trimRight',
  [],
  R.always(value.trimRight()),
  toStringResult,
);

export const empty = value => createNativeFunctionValue(
  'empty',
  [],
  R.always(value.length === 0),
  toBooleanResult,
);

export const length = value => createNativeFunctionValue(
  'length',
  [],
  R.always(value.length),
  toNumericResult,
);

export const roll = value => createNativeFunctionValue(
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
