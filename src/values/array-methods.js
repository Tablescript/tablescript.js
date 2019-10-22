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
import { isUndefined } from './types';
import {
  createNativeFunctionValue,
  nativeFunctionParameter,
  requiredParameterF,
  optionalParameterF,
  optionalNumericParameterF,
  optionalStringParameterF,
  toNativeNumber,
  toNativeString,
  toNumericResult,
  toStringResult,
  toBooleanResult,
  toArrayResult,
} from './native-function';
import { quickSort } from '../util/sort';
import { randomNumber } from '../util/random';

const indexedReduce = R.addIndex(R.reduce);
const indexedMap = R.addIndex(R.map);
const indexedFilter = R.addIndex(R.filter);

export const each = entries => createNativeFunctionValue(
  'each',
  [
    nativeFunctionParameter('f', requiredParameterF()),
  ],
  (context, args, f) => indexedReduce(
    (_, entry, i) => f.callFunction(context, [entry, context.factory.createNumericValue(i)]),
    context.factory.createUndefined(),
    entries,
  ),
);

export const reduce = entries => createNativeFunctionValue(
  'reduce',
  [
    nativeFunctionParameter('reducer', requiredParameterF()),
    nativeFunctionParameter('initialValue', requiredParameterF()),
  ],
  (context, args, reducer, initialValue) => indexedReduce(
    (acc, entry, i) => reducer.callFunction(context, [acc, entry, context.factory.createNumericValue(i)]),
    initialValue,
    entries,
  ),
);

export const map = entries => createNativeFunctionValue(
  'map',
  [
    nativeFunctionParameter('f', requiredParameterF()),
  ],
  (context, args, f) => indexedMap(
    (entry, i) => f.callFunction(context, [entry, context.factory.createNumericValue(i)]),
    entries,
  ),
  toArrayResult,
);

export const filter = entries => createNativeFunctionValue(
  'filter',
  [
    nativeFunctionParameter('f', requiredParameterF()),
  ],
  (context, args, f) => indexedFilter(
    (entry, i) => f.callFunction(context, [entry, context.factory.createNumericValue(i)]).asNativeBoolean(),
    entries,
  ),
  toArrayResult,
);

export const includes = entries => createNativeFunctionValue(
  'includes',
  [
    nativeFunctionParameter('value', requiredParameterF()),
  ],
  (context, args, value) => R.reduce((result, entry) => result || entry.nativeEquals(value), false, entries),
  toBooleanResult,
);

export const indexOf = entries => createNativeFunctionValue(
  'indexOf',
  [
    nativeFunctionParameter('value', requiredParameterF()),
  ],
  (context, args, value) => R.findIndex(entry => entry.nativeEquals(value), entries),
  toNumericResult,
);

export const find = entries => createNativeFunctionValue(
  'find',
  [
    nativeFunctionParameter('f', requiredParameterF()),
  ],
  (context, args, f) => R.reduce(
    (foundValue, entry) => {
      if (isUndefined(foundValue)) {
        if (f.callFunction(context, [entry]).asNativeBoolean()) {
          return entry;
        }
      }
      return foundValue;
    },
    context.factory.createUndefined(),
    entries,
  ),
);

export const findIndex = entries => createNativeFunctionValue(
  'findIndex',
  [
    nativeFunctionParameter('f', requiredParameterF()),
  ],
  (context, args, f) => indexedReduce(
    (foundIndex, entry, i) => {
      if (foundIndex === -1) {
        if (f.callFunction(context, [entry]).asNativeBoolean()) {
          return i;
        }
      }
      return foundIndex;
    },
    -1,
    entries,
  ),
  toNumericResult,
);

export const defaultSorter = createNativeFunctionValue(
  'defaultSorter',
  [
    nativeFunctionParameter('a', requiredParameterF()),
    nativeFunctionParameter('b', requiredParameterF()),
  ],
  (context, args, a, b) => a.compare(context, b),
);

export const sort = entries => createNativeFunctionValue(
  'sort',
  [
    nativeFunctionParameter('f', optionalParameterF()),
  ],
  (context, args, f) => (args.length === 1 ? (
    quickSort(context, [...entries], f)
  ) : (
    quickSort(context, [...entries], defaultSorter)
  )),
  toArrayResult,
);

export const join = entries => createNativeFunctionValue(
  'join',
  [
    nativeFunctionParameter('separator', optionalStringParameterF(toNativeString)),
  ],
  (_, args, separator) => (args.length === 1 ? (
    entries.map(e => e.asNativeString()).join(separator)
  ) : (
    entries.map(e => e.asNativeString()).join()
  )),
  toStringResult,
);

export const reverse = entries => createNativeFunctionValue(
  'reverse',
  [],
  () => R.reverse(entries),
  toArrayResult,
);

export const slice = entries => createNativeFunctionValue(
  'slice',
  [
    nativeFunctionParameter('begin', optionalNumericParameterF(toNativeNumber)),
    nativeFunctionParameter('end', optionalNumericParameterF(toNativeNumber)),
  ],
  (_, args, begin, end) => {
    if (args.length === 2) {
      return entries.slice(begin, end);
    }
    if (args.length === 1) {
      return entries.slice(begin);
    }
    return entries.slice();
  },
  toArrayResult,
);

export const unique = entries => createNativeFunctionValue(
  'unique',
  [],
  () => R.uniqWith((a, b) => a.identicalTo(b), entries),
  toArrayResult,
);

export const length = entries => createNativeFunctionValue(
  'length',
  [],
  R.always(entries.length),
  toNumericResult,
);

export const choose = entries => createNativeFunctionValue(
  'choose',
  [],
  () => entries[randomNumber(entries.length) - 1],
);
