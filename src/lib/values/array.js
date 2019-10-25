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
import { valueTypes, isArray } from './types';
import { throwRuntimeError } from '../error';
import {
  choose,
  each,
  filter,
  includes,
  indexOf,
  find,
  findIndex,
  length,
  join,
  map,
  reduce,
  reverse,
  slice,
  sort,
  unique,
} from './array-methods';

const entriesAsNativeValues = entries => entries.map(e => e.asNativeValue());

const identicalTo = entries => other => isArray(other) && entriesAsNativeValues(entries) == other.asNativeArray();

const asNativeString = entries => () => JSON.stringify(entriesAsNativeValues(entries));

const asNativeBoolean = () => true;

const asNativeArray = entries => () => entriesAsNativeValues(entries);

const nativeEquals = entries => other => {
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

export const createArrayValue = entries => createValue(
  valueTypes.ARRAY,
  asNativeArray(entries),
  identicalTo(entries),
  nativeEquals(entries),
  {
    choose: choose(entries),
    each: each(entries),
    filter: filter(entries),
    includes: includes(entries),
    indexOf: indexOf(entries),
    find: find(entries),
    findIndex: findIndex(entries),
    length: length(entries),
    join: join(entries),
    map: map(entries),
    reduce: reduce(entries),
    reverse: reverse(entries),
    slice: slice(entries),
    sort: sort(entries),
    unique: unique(entries),
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
