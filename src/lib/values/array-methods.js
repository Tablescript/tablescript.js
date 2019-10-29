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
  toNumericResult,
  toStringResult,
  toBooleanResult,
  toArrayResult,
  toObjectResult,
} from './native-function';
import { quickSort } from '../util/sort';
import { randomNumber } from '../util/random';

const indexedReduce = R.addIndex(R.reduce);
const indexedMap = R.addIndex(R.map);
const indexedFilter = R.addIndex(R.filter);

export const append = entries => createNativeFunctionValue(
  'append',
  ['i'],
  (context, args, i) => ([...entries, i]),
  toArrayResult,
);

export const each = entries => createNativeFunctionValue(
  'each',
  ['f'],
  (context, args, f) => indexedReduce(
    (_, entry, i) => f.callFunction(context, [entry, context.factory.createNumericValue(i)]),
    context.factory.createUndefined(),
    entries,
  ),
);

export const countBy = entries => createNativeFunctionValue(
  'countBy',
  ['f'],
  (context, args, f) => R.fromPairs(
    R.map(
      ([key, value]) => ([key, context.factory.createNumericValue(value)]),
      R.toPairs(
        indexedReduce(
          (acc, entry, i) => {
            const key = f.callFunction(context, [entry, context.factory.createNumericValue(i)]).asNativeString();
            return {
              ...acc,
              [key]: R.has(key, acc) ? acc[key] + 1 : 1,
            };
          },
          {},
          entries,
        ),
      ),
    ),
  ),
  toObjectResult
);

export const every = entries => createNativeFunctionValue(
  'every',
  ['f'],
  (context, args, f) => indexedReduce(
    (b, entry, i) => b && f.callFunction(context, [entry, context.factory.createNumericValue(i)]).asNativeBoolean(),
    true,
    entries,
  ),
  toBooleanResult,
);

export const some = entries => createNativeFunctionValue(
  'some',
  ['f'],
  (context, args, f) => indexedReduce(
    (b, entry, i) => b || f.callFunction(context, [entry, context.factory.createNumericValue(i)]).asNativeBoolean(),
    false,
    entries,
  ),
  toBooleanResult,
);

export const reduce = entries => createNativeFunctionValue(
  'reduce',
  ['reducer', 'initialValue'],
  (context, args, reducer, initialValue) => indexedReduce(
    (acc, entry, i) => reducer.callFunction(context, [acc, entry, context.factory.createNumericValue(i)]),
    initialValue,
    entries,
  ),
);

export const map = entries => createNativeFunctionValue(
  'map',
  ['f'],
  (context, args, f) => indexedMap(
    (entry, i) => f.callFunction(context, [entry, context.factory.createNumericValue(i)]),
    entries,
  ),
  toArrayResult,
);

export const filter = entries => createNativeFunctionValue(
  'filter',
  ['f'],
  (context, args, f) => indexedFilter(
    (entry, i) => f.callFunction(context, [entry, context.factory.createNumericValue(i)]).asNativeBoolean(),
    entries,
  ),
  toArrayResult,
);

export const includes = entries => createNativeFunctionValue(
  'includes',
  ['value'],
  (context, args, value) => R.reduce((result, entry) => result || entry.nativeEquals(value), false, entries),
  toBooleanResult,
);

export const indexOf = entries => createNativeFunctionValue(
  'indexOf',
  ['value'],
  (context, args, value) => R.findIndex(entry => entry.nativeEquals(value), entries),
  toNumericResult,
);

export const find = entries => createNativeFunctionValue(
  'find',
  ['f'],
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
  ['f'],
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
  ['a', 'b'],
  (context, args, a, b) => a.compare(context, b),
);

export const sort = entries => createNativeFunctionValue(
  'sort',
  ['f'],
  (context, args, f) => (isUndefined(f) ? (
    quickSort(context, [...entries], defaultSorter)
  ) : (
    quickSort(context, [...entries], f)
  )),
  toArrayResult,
);

export const join = entries => createNativeFunctionValue(
  'join',
  ['separator'],
  (_, args, separator) => (isUndefined(separator) ? (
    entries.map(e => e.asNativeString()).join()
  ) : (
    entries.map(e => e.asNativeString()).join(separator.asNativeString())
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
  ['begin', 'end'],
  (_, args, begin, end) => {
    if (isUndefined(begin)) {
      return entries.slice();
    }
    if (isUndefined(end)) {
      return entries.slice(begin.asNativeNumber());
    }
    return entries.slice(begin.asNativeNumber(), end.asNativeNumber());
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
