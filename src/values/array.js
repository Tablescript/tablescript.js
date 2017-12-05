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

import { throwRuntimeError, runtimeErrorThrower } from '../error';
import { defaultValue } from './default';
import { valueTypes } from './types';
import { createNativeFunctionValue } from './function';
import { createNumericValue } from './numeric';
import { createBooleanValue } from './boolean';
import { createStringValue } from './string';
import { createUndefined } from './undefined';
import { quickSort } from './sort';

export const createArrayValue = entries => {
  const entriesAsNativeValues = (context, entries) => entries.map(e => e.asNativeValue(context));

  const asNativeString = context => JSON.stringify(entriesAsNativeValues(context, entries));
  const asNativeBoolean = () => true;
  const asNativeArray = context => entriesAsNativeValues(context, entries);

  const equals = (context, other) => {
    if (other.type !== valueTypes.ARRAY) {
      return false;
    }
    const otherEntries = other.asArray();
    if (otherEntries.length !== entries.length) {
      return false;
    }
    return entries.reduce((result, entry, index) => result && entry.equals(context, otherEntries[index]), true);
  };

  const asString = context => createStringValue(asNativeString(context));
  const asBoolean = () => createBooleanValue(asNativeBoolean());
  const asArray = () => entries;

  const getProperty = (context, name) => {
    const nameValue = name.asNativeString(context);
    if (members[nameValue]) {
      return members[nameValue];
    }
    return createUndefined();
  };

  const setProperty = (context, index, value) => {
    let indexValue = index.asNativeNumber(context);
    if (indexValue < 0) {
      indexValue = entries.length + indexValue;
    }
    if (indexValue < 0 || indexValue >= entries.length) {
      throwRuntimeError('Index out of range', context);
    }
    entries[indexValue] = value;
    return value;
  };

  const getElement = (context, index) => {
    let indexValue = index.asNativeNumber(context);
    if (indexValue < 0) {
      indexValue = entries.length + indexValue;
    }
    if (indexValue < 0 || indexValue >= entries.length) {
      return createUndefined();
    }
    return entries[indexValue];
  };

  const reduce = createNativeFunctionValue(['reducer', 'initialValue'], async (context, scope) => {
    const reducer = scope['reducer'];
    const initialValue = scope['initialValue'];
    let result = initialValue;
    for (let i = 0; i < entries.length; i++) {
      result = await reducer.callFunction(context, scope, [result, entries[i]]);
    }
    return result;
  });

  const map = createNativeFunctionValue(['f'], async (context, scope) => {
    const f = scope['f'];
    const result = [];
    for (let i = 0; i < entries.length; i++) {
      result.push(await f.callFunction(context, scope, [entries[i]]));
    }
    return createArrayValue(result);
  });

  const filter = createNativeFunctionValue(['f'], async (context, scope) => {
    const f = scope['f'];
    const result = [];
    for (let i = 0; i < entries.length; i++) {
      const testValue = await f.callFunction(context, scope, [entries[i]]);
      if (testValue.asNativeBoolean(context)) {
        result.push(entries[i]);
      }
    }
    return createArrayValue(result);
  });

  const includes = createNativeFunctionValue(['value'], (context, scope) => {
    const value = scope['value'];
    return createBooleanValue(entries.reduce((result, entry) => result || entry.equals(context, value), false));
  });

  const indexOf = createNativeFunctionValue(['value'], (context, scope) => {
    const value = scope['value'];
    for (let i = 0; i < entries.length; i++) {
      if (entries[i].equals(context, value)) {
        return createNumericValue(i);
      }
    }
    return createNumericValue(-1);
  });

  const find = createNativeFunctionValue(['f'], async (context, scope) => {
    const f = scope['f'];
    for (let i = 0; i < entries.length; i++) {
      const testValue = await f.callFunction(context, scope, [entries[i]]);
      if (testValue.asNativeBoolean(context)) {
        return entries[i];
      }
    }
    return createUndefined();
  });

  const findIndex = createNativeFunctionValue(['f'], async (context, scope) => {
    const f = scope['f'];
    for (let i = 0; i < entries.length; i++) {
      const testValue = await f.callFunction(context, scope, [entries[i]]);
      if (testValue.asNativeBoolean(context)) {
        return createNumericValue(i);
      }
    }
    return createNumericValue(-1);
  });

  const sort = createNativeFunctionValue(['f'], async (context, scope) => {
    const f = scope['f'];
    return createArrayValue(await quickSort(context, scope, [...entries], f));
  });

  const join = createNativeFunctionValue(['separator'], (context, scope) => {
    const separator = scope['separator'];
    if (separator) {
      if (separator.type !== valueTypes.STRING) {
        throwRuntimeError(`join([separator]) separator must be a string`, context);
      }
      return createStringValue(entries.map(e => e.asNativeString(context)).join(separator.asNativeString(context)));
    }
    return createStringValue(entries.map(e => e.asNativeString(context)).join());
  });

  const reverse = createNativeFunctionValue([], (context, scope) => {
    return createArrayValue([...entries].reverse());
  });

  const members = {
    reduce,
    map,
    filter,
    includes,
    indexOf,
    find,
    findIndex,
    sort,
    join,
    reverse,
    length: createNumericValue(entries.length),
  };

  return {
    ...defaultValue(valueTypes.ARRAY, asNativeArray),
    asNativeString,
    asNativeBoolean,
    asNativeArray,
    equals,
    asString,
    asBoolean,
    asArray,
    getProperty,
    setProperty,
    getElement,
  };
};

