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
import { createNumericValue } from './numeric';
import { createBooleanValue } from './boolean';
import { createStringValue } from './string';
import { createUndefined } from './undefined';
import { createNativeFunctionValue } from './function';
import { quickSort } from '../util/sort';

const entriesAsNativeValues = (context, entries) => entries.map(e => e.asNativeValue(context));

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

const asString = asNativeString => context => createStringValue(asNativeString(context));

const asBoolean = asNativeBoolean => () => createBooleanValue(asNativeBoolean());

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
    return createUndefined();
  }
  return entries[indexValue];
};

const add = entries => (context, other) => createArrayValue([...entries, other]);

const multiplyBy = entries => (context, other) => createArrayValue(R.range(0, other.asNativeNumber(context)).reduce((all,n) => ([...all, ...entries]), []));

const equals = nativeEquals => (context, other) => createBooleanValue(nativeEquals(context, other));

const notEquals = nativeEquals => (context, other) => createBooleanValue(!nativeEquals(context, other));

const requiredParameter = (context, name) => {
  if (context.scope[name]) {
    return context.scope[name];
  }
  throwRuntimeError(`Missing required parameter ${name}`, context);
};

const optionalParameter = (context, name) => context.scope[name];

const reduce = entries => createNativeFunctionValue(['reducer', 'initialValue'], async context => {
  const reducer = requiredParameter(context, 'reducer');
  const initialValue = requiredParameter(context, 'initialValue');
  let result = initialValue;
  for (let i = 0; i < entries.length; i++) {
    result = await reducer.callFunction(context, [result, entries[i], createNumericValue(i)]);
  }
  return result;
});

const map = entries => createNativeFunctionValue(['f'], async context => {
  const f = requiredParameter(context, 'f');
  const result = [];
  for (let i = 0; i < entries.length; i++) {
    result.push(await f.callFunction(context, [entries[i], createNumericValue(i)]));
  }
  return createArrayValue(result);
});

const filter = entries => createNativeFunctionValue(['f'], async context => {
  const f = requiredParameter(context, 'f');
  const result = [];
  for (let i = 0; i < entries.length; i++) {
    const testValue = await f.callFunction(context, [entries[i], createNumericValue(i)]);
    if (testValue.asNativeBoolean(context)) {
      result.push(entries[i]);
    }
  }
  return createArrayValue(result);
});

const includes = entries => createNativeFunctionValue(['value'], context => {
  const value = optionalParameter(context, 'value');
  if (value) {
    return Promise.resolve(createBooleanValue(entries.reduce((result, entry) => result || entry.nativeEquals(context, value), false)));
  }
  return Promise.resolve(createUndefined());
});

const indexOf = entries => createNativeFunctionValue(['value'], context => {
  const value = optionalParameter(context, 'value');
  for (let i = 0; i < entries.length; i++) {
    if (entries[i].nativeEquals(context, value)) {
      return Promise.resolve(createNumericValue(i));
    }
  }
  return Promise.resolve(createNumericValue(-1));
});

const find = entries => createNativeFunctionValue(['f'], async context => {
  const f = requiredParameter(context, 'f');
  for (let i = 0; i < entries.length; i++) {
    const testValue = await f.callFunction(context, [entries[i]]);
    if (testValue.asNativeBoolean(context)) {
      return entries[i];
    }
  }
  return createUndefined();
});

const findIndex = entries => createNativeFunctionValue(['f'], async context => {
  const f = requiredParameter(context, 'f');
  for (let i = 0; i < entries.length; i++) {
    const testValue = await f.callFunction(context, [entries[i]]);
    if (testValue.asNativeBoolean(context)) {
      return createNumericValue(i);
    }
  }
  return createNumericValue(-1);
});

const sort = entries => createNativeFunctionValue(['f'], async context => {
  const f = requiredParameter(context, 'f');
  return createArrayValue(await quickSort(context, [...entries], f));
});

const join = entries => createNativeFunctionValue(['separator'], context => {
  const separator = optionalParameter(context, 'separator');
  if (separator) {
    if (!isString(separator)) {
      throwRuntimeError(`join([separator]) separator must be a string`, context);
    }
    return Promise.resolve(createStringValue(entries.map(e => e.asNativeString(context)).join(separator.asNativeString(context))));
  }
  return Promise.resolve(createStringValue(entries.map(e => e.asNativeString(context)).join()));
});

const reverse = entries => createNativeFunctionValue([], context => {
  return Promise.resolve(createArrayValue([...entries].reverse()));
});

export const createArrayValue = entries => createValue(
  valueTypes.ARRAY,
  asNativeArray(entries),
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
    length: createNumericValue(entries.length),
  },
  {
    asNativeString: asNativeString(entries),
    asNativeBoolean: asNativeBoolean(),
    asNativeArray: asNativeArray(entries),
    nativeEquals: nativeEquals(entries),
    asString: R.pipe(asNativeString, asString)(entries),
    asBoolean: R.pipe(asNativeBoolean, asBoolean)(),
    asArray: asArray(entries),
    setProperty: setProperty(entries),
    getElement: getElement(entries),
    add: add(entries),
    multiplyBy: multiplyBy(entries),
    equals: R.pipe(nativeEquals, equals)(entries),
    notEquals: R.pipe(nativeEquals, notEquals)(entries),
  },
);
