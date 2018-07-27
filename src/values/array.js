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
import { valueTypes, isArray, isString } from './types';
import { throwRuntimeError } from '../error';
import { createNativeFunctionValue } from './function';
import { requiredParameter, optionalParameter } from '../util/parameters';
import { quickSort } from '../util/sort';

const entriesAsNativeValues = (context, entries) => entries.map(e => e.asNativeValue(context));

const identicalTo = entries => (context, other) => isArray(other) && entriesAsNativeValues(context, entries) == other.asNativeArray(context);

const asNativeString = entries => context => JSON.stringify(entriesAsNativeValues(context, entries));

const asNativeBoolean = () => () => true;

const asNativeArray = entries => context => entriesAsNativeValues(context, entries);

const nativeEquals = entries => (context, other) => {
  if (!isArray(other)) {
    return false;
  }
  const otherEntries = other.asArray();
  if (otherEntries.length !== entries.length) {
    return false;
  }
  return entries.reduce((result, entry, index) => result && entry.nativeEquals(context, otherEntries[index]), true);
};

const asArray = entries => () => entries;

const mapArrayIndex = (context, index, entries) => {
  const mappedIndex = index.asNativeNumber(context);
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

const multiplyBy = entries => (context, other) => createArrayValue(R.range(0, other.asNativeNumber(context)).reduce((all,n) => ([...all, ...entries]), []));

const reduce = entries => createNativeFunctionValue(['reducer', 'initialValue'], async context => {
  const reducer = requiredParameter(context, 'reducer');
  const initialValue = requiredParameter(context, 'initialValue');
  let result = initialValue;
  for (let i = 0; i < entries.length; i++) {
    result = await reducer.callFunction(context, [result, entries[i], context.factory.createNumericValue(i)]);
  }
  return result;
});

const map = entries => createNativeFunctionValue(['f'], async context => {
  const f = requiredParameter(context, 'f');
  const result = [];
  for (let i = 0; i < entries.length; i++) {
    result.push(await f.callFunction(context, [entries[i], context.factory.createNumericValue(i)]));
  }
  return createArrayValue(result);
});

const filter = entries => createNativeFunctionValue(['f'], async context => {
  const f = requiredParameter(context, 'f');
  const result = [];
  for (let i = 0; i < entries.length; i++) {
    const testValue = await f.callFunction(context, [entries[i], context.factory.createNumericValue(i)]);
    if (testValue.asNativeBoolean(context)) {
      result.push(entries[i]);
    }
  }
  return createArrayValue(result);
});

const includes = entries => createNativeFunctionValue(['value'], async context => {
  const value = optionalParameter(context, 'value');
  if (value) {
    return context.factory.createBooleanValue(
      entries.reduce(
        (result, entry) => result || entry.nativeEquals(context, value),
        false
      )
    );
  }
  return context.factory.createUndefined();
});

const indexOf = entries => createNativeFunctionValue(['value'], async context => {
  const value = optionalParameter(context, 'value');
  for (let i = 0; i < entries.length; i++) {
    if (entries[i].nativeEquals(context, value)) {
      return context.factory.createNumericValue(i);
    }
  }
  return context.factory.createNumericValue(-1);
});

const find = entries => createNativeFunctionValue(['f'], async context => {
  const f = requiredParameter(context, 'f');
  for (let i = 0; i < entries.length; i++) {
    const testValue = await f.callFunction(context, [entries[i]]);
    if (testValue.asNativeBoolean(context)) {
      return entries[i];
    }
  }
  return context.factory.createUndefined();
});

const findIndex = entries => createNativeFunctionValue(['f'], async context => {
  const f = requiredParameter(context, 'f');
  for (let i = 0; i < entries.length; i++) {
    const testValue = await f.callFunction(context, [entries[i]]);
    if (testValue.asNativeBoolean(context)) {
      return context.factory.createNumericValue(i);
    }
  }
  return context.factory.createNumericValue(-1);
});

const defaultSorter = createNativeFunctionValue(['a', 'b'], async context => {
  return requiredParameter(context, 'a').subtract(context, requiredParameter(context, 'b'));
});

const sort = entries => createNativeFunctionValue(['f'], async context => {
  const f = optionalParameter(context, 'f');
  if (f) {
    return createArrayValue(await quickSort(context, [...entries], f));
  }
  return createArrayValue(await quickSort(context, [...entries], defaultSorter));
});

const join = entries => createNativeFunctionValue(['separator'], async context => {
  const separator = optionalParameter(context, 'separator');
  if (separator) {
    if (!isString(separator)) {
      throwRuntimeError(`join([separator]) separator must be a string`, context);
    }
    return context.factory.createStringValue(entries.map(e => e.asNativeString(context)).join(separator.asNativeString(context)));
  }
  return context.factory.createStringValue(entries.map(e => e.asNativeString(context)).join());
});

const reverse = entries => createNativeFunctionValue([], async context => {
  return createArrayValue([...entries].reverse());
});

const slice = entries => createNativeFunctionValue(['begin', 'end'], async context => {
  const begin = optionalParameter(context, 'begin');
  if (begin) {
    const end = optionalParameter(context, 'end');
    if (end) {
      return createArrayValue(entries.slice(begin.asNativeNumber(context), end.asNativeNumber(context)));
    }
    return createArrayValue(entries.slice(begin.asNativeNumber(context)));
  }
  return createArrayValue(entries.slice());
});

const unique = entries => createNativeFunctionValue([], async context => {
  const results = [];
  for (const entry of entries) {
    if (!results.find(r => r.identicalTo(context, entry))) {
      results.push(entry);
      continue;
    }
  }
  return createArrayValue(results);
});

const length = entries => createNativeFunctionValue([], async context => {
  return context.factory.createNumericValue(entries.length);
});

export const createArrayValue = entries => createValue(
  valueTypes.ARRAY,
  asNativeArray(entries),
  identicalTo(entries),
  nativeEquals(entries),
  {
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
  },
  {
    asNativeString: asNativeString(entries),
    asNativeBoolean: asNativeBoolean(),
    asNativeArray: asNativeArray(entries),
    asArray: asArray(entries),
    setProperty: setProperty(entries),
    getElement: getElement(entries),
    add: add(entries),
    multiplyBy: multiplyBy(entries),
  },
);
