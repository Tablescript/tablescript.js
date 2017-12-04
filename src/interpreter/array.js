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
import { valueTypes } from './types';
import { createNativeFunctionValue } from './function';
import { createNumericValue } from './numeric';
import { createBooleanValue } from './boolean';
import { createStringValue } from './string';
import { createUndefined } from './undefined';

export const createArrayValue = entries => {
  const asNativeString = context => JSON.stringify(entries.map(e => e.asNativeValue(context)));
  const asNativeBoolean = () => true;
  const asNativeArray = context => entries.map(e => e.asNativeValue(context));
  const asString = context => createStringValue(asNativeString(context));
  const asBoolean = context => createBooleanValue(asNativeBoolean(context));

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
    if (value) {
      return createBooleanValue(entries.reduce((result, entry) => result || entry.equals(context, value), false));
    }
    return createUndefined();
  });

  const members = {
    reduce,
    map,
    filter,
    includes,
    length: createNumericValue(entries.length),
  };

  return {
    type: valueTypes.ARRAY,
    asNativeValue: asNativeArray,
    asNativeNumber: runtimeErrorThrower('Cannot cast array to number'),
    asNativeString,
    asNativeBoolean,
    asNativeArray,
    equals: runtimeErrorThrower('Array equality unimplemented'),
    asNumber: runtimeErrorThrower('Cannot cast array to number'),
    asString,
    asBoolean,
    getProperty,
    setProperty,
    getProperties: runtimeErrorThrower('Cannot get properties of array'),
    getElement,
    getElements: () => entries,
    callFunction: runtimeErrorThrower('Cannot call array'),
  };
};
