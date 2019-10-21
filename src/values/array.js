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
import { valueTypes, isArray, isUndefined } from './types';
import { throwRuntimeError } from '../error';
import { createNativeFunctionValue } from './function';
import { quickSort } from '../util/sort';
import {
  withRequiredParameter,
  withOptionalParameter,
  withOptionalStringParameter,
  withArrayResult,
  withBooleanResult,
  withNumericResult,
  withStringResult,
} from './util/methods';
import { randomNumber } from '../util/random';

const entriesAsNativeValues = entries => entries.map(e => e.asNativeValue());

const identicalTo = entries => other => isArray(other) && entriesAsNativeValues(entries) == other.asNativeArray();

const asNativeString = entries => () => JSON.stringify(entriesAsNativeValues(entries));

const asNativeBoolean = () => true;

const asNativeArray = entries => () => entriesAsNativeValues(entries);

const nativeEquals = entries => (other) => {
  if (!isArray(other)) {
    return false;
  }
  const otherEntries = other.asArray();
  if (otherEntries.length !== entries.length) {
    return false;
  }
  return entries.reduce((result, entry, index) => result && entry.nativeEquals(otherEntries[index]), true);
};

const asArray = entries => () => entries;

const mapArrayIndex = (context, index, entries) => {
  const mappedIndex = index.asNativeNumber();
  if (mappedIndex < 0) {
    return entries.length + mappedIndex;
  }
  return mappedIndex;
};

const isValidIndex = (index, entries) => (index >= 0 && index < entries.length);

const setProperty = entries => (context, index, value) => {
  const indexValue = mapArrayIndex(context, index, entries);
  if (!isValidIndex(indexValue, entries)) {
    throwRuntimeError('Index out of range', context);
  }
  entries[indexValue] = value;
  return value;
};

const getElement = entries => (context, index) => {
  const indexValue = mapArrayIndex(context, index, entries);
  if (!isValidIndex(indexValue, entries)) {
    return context.factory.createUndefined();
  }
  return entries[indexValue];
};

const add = entries => (context, other) => createArrayValue([...entries, other]);

const multiplyBy = entries => (context, other) => createArrayValue(
  R.range(
    0,
    other.asNativeNumber()
  ).reduce((all,n) => ([...all, ...entries]), [])
);

const indexedReduce = R.addIndex(R.reduce);
const indexedMap = R.addIndex(R.map);
const indexedFilter = R.addIndex(R.filter);

const each = entries => createNativeFunctionValue(
  ['f'],
  R.compose(
    withRequiredParameter('f'),
  )(
    (context, f) => indexedReduce(
      (_, entry, i) => f.callFunction(context, [entry, context.factory.createNumericValue(i)]),
      context.factory.createUndefined(),
      entries,
    ),
  ),
);

const reduce = entries => createNativeFunctionValue(
  ['reducer', 'initialValue'],
  R.compose(
    withRequiredParameter('initialValue'),
    withRequiredParameter('reducer'),
  )(
    (context, reducer, initialValue) => indexedReduce(
      (acc, entry, i) => reducer.callFunction(context, [acc, entry, context.factory.createNumericValue(i)]),
      initialValue,
      entries,
    ),
  ),
);

const map = entries => createNativeFunctionValue(
  ['mapf'],
  R.compose(
    withArrayResult,
    withRequiredParameter('mapf'),
  )(
    (context, f) => indexedMap(
      (entry, i) => f.callFunction(context, [entry, context.factory.createNumericValue(i)]),
      entries,
    ),
  ),
);

const filter = entries => createNativeFunctionValue(
  ['f'],
  R.compose(
    withArrayResult,
    withRequiredParameter('f'),
  )(
    (context, f) => indexedFilter(
      (entry, i) => f.callFunction(context, [entry, context.factory.createNumericValue(i)]).asNativeBoolean(),
      entries,
    ),
  ),
);

const includes = entries => createNativeFunctionValue(
  ['value'],
  R.compose(
    withBooleanResult,
    withRequiredParameter('value'),
  )(
    (context, value) => R.reduce((result, entry) => result || entry.nativeEquals(value), false, entries),
  ),
);

const indexOf = entries => createNativeFunctionValue(
  ['value'],
  R.compose(
    withNumericResult,
    withRequiredParameter('value'),
  )(
    (context, value) => R.findIndex(entry => entry.nativeEquals(value), entries),
  ),
);

const find = entries => createNativeFunctionValue(
  ['f'],
  R.compose(
    withRequiredParameter('f'),
  )(
    (context, f) => R.reduce(
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
    )
  ),
);

const findIndex = entries => createNativeFunctionValue(
  ['f'],
  R.compose(
    withNumericResult,
    withRequiredParameter('f'),
  )(
    (context, f) => indexedReduce(
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
  ),
);

const defaultSorter = createNativeFunctionValue(
  ['a', 'b'],
  R.compose(
    withRequiredParameter('b'),
    withRequiredParameter('a'),
  )(
    (context, a, b) => a.compare(context, b)
  ),
);

const sort = entries => createNativeFunctionValue(
  ['f'],
  R.compose(
    withArrayResult,
    withOptionalParameter('f'),
  )(
    (context, f) => (!isUndefined(f) ? quickSort(context, [...entries], f) : quickSort(context, [...entries], defaultSorter)),
  ),
);

const join = entries => createNativeFunctionValue(
  ['separator'],
  R.compose(
    withStringResult,
    withOptionalStringParameter('separator', 'join([separator])'),
  )(
    (context, separator) => (isUndefined(separator) ? (
      entries.map(e => e.asNativeString()).join()
    ) : (
      entries.map(e => e.asNativeString()).join(separator.asNativeString())
    )),
  ),
);

const reverse = entries => createNativeFunctionValue(
  [],
  R.compose(
    withArrayResult,
  )(
    context => R.reverse(entries),
  )
);

const slice = entries => createNativeFunctionValue(
  ['begin', 'end'],
  R.compose(
    withArrayResult,
    withOptionalParameter('end'),
    withOptionalParameter('begin'),
  )(
    (context, begin, end) => (!isUndefined(begin) ? (
      !isUndefined(end) ? (
        entries.slice(begin.asNativeNumber(), end.asNativeNumber())
      ) : (
        entries.slice(begin.asNativeNumber())
      )
    ) : (
      entries.slice()
    )),
  ),
);

const unique = entries => createNativeFunctionValue(
  [],
  R.compose(
    withArrayResult,
  )(
    context => R.uniqWith((a, b) => a.identicalTo(b), entries)
  ),
);

const length = entries => createNativeFunctionValue(
  [],
  R.compose(
    withNumericResult,
  )(
    R.always(entries.length),
  ),
);

const choose = entries => createNativeFunctionValue(
  [],
  context => entries[randomNumber(entries.length) - 1],
);

export const createArrayValue = entries => createValue(
  valueTypes.ARRAY,
  asNativeArray(entries),
  identicalTo(entries),
  nativeEquals(entries),
  {
    each: each(entries),
    reduce: reduce(entries),
    map: map(entries),
    filter: filter(entries),
    includes: includes(entries),
    indexOf: indexOf(entries),
    find: find(entries),
    findIndex: findIndex(entries),
    sort: sort(entries),
    join: join(entries),
    reverse: reverse(entries),
    slice: slice(entries),
    unique: unique(entries),
    length: length(entries),
    choose: choose(entries),
  },
  {
    asNativeString: asNativeString(entries),
    asNativeBoolean,
    asNativeArray: asNativeArray(entries),
    asArray: asArray(entries),
    setProperty: setProperty(entries),
    getElement: getElement(entries),
    add: add(entries),
    multiplyBy: multiplyBy(entries),
  },
);
