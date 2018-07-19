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

import { createNativeFunctionValue } from './function';
import { createArrayValue } from './array';
import { createNumericValue } from './numeric';
import { createUndefined } from './undefined';
import { createBooleanValue } from './boolean';
import { createStringValue } from './string';
import { isString } from './types';
import { quickSort } from '../util/sort';

const reduce = entries => createNativeFunctionValue(['reducer', 'initialValue'], async context => {
  const reducer = context.scope['reducer'];
  const initialValue = context.scope['initialValue'];
  let result = initialValue;
  for (let i = 0; i < entries.length; i++) {
    result = await reducer.callFunction(context, [result, entries[i]]);
  }
  return result;
});

const map = entries => createNativeFunctionValue(['f'], async context => {
  const f = context.scope['f'];
  const result = [];
  for (let i = 0; i < entries.length; i++) {
    result.push(await f.callFunction(context, [entries[i]]));
  }
  return createArrayValue(result);
});

const filter = entries => createNativeFunctionValue(['f'], async context => {
  const f = context.scope['f'];
  const result = [];
  for (let i = 0; i < entries.length; i++) {
    const testValue = await f.callFunction(context, [entries[i]]);
    if (testValue.asNativeBoolean(context)) {
      result.push(entries[i]);
    }
  }
  return createArrayValue(result);
});

const includes = entries => createNativeFunctionValue(['value'], context => {
  const value = context.scope['value'];
  if (value) {
    return Promise.resolve(createBooleanValue(entries.reduce((result, entry) => result || entry.nativeEquals(context, value), false)));
  }
  return Promise.resolve(createUndefined());
});

const indexOf = entries => createNativeFunctionValue(['value'], context => {
  const value = context.scope['value'];
  for (let i = 0; i < entries.length; i++) {
    if (entries[i].nativeEquals(context, value)) {
      return Promise.resolve(createNumericValue(i));
    }
  }
  return Promise.resolve(createNumericValue(-1));
});

const find = entries => createNativeFunctionValue(['f'], async context => {
  const f = context.scope['f'];
  for (let i = 0; i < entries.length; i++) {
    const testValue = await f.callFunction(context, [entries[i]]);
    if (testValue.asNativeBoolean(context)) {
      return entries[i];
    }
  }
  return createUndefined();
});

const findIndex = entries => createNativeFunctionValue(['f'], async context => {
  const f = context.scope['f'];
  for (let i = 0; i < entries.length; i++) {
    const testValue = await f.callFunction(context, [entries[i]]);
    if (testValue.asNativeBoolean(context)) {
      return createNumericValue(i);
    }
  }
  return createNumericValue(-1);
});

const sort = entries => createNativeFunctionValue(['f'], async context => {
  const f = context.scope['f'];
  return createArrayValue(await quickSort(context, [...entries], f));
});

const join = entries => createNativeFunctionValue(['separator'], context => {
  const separator = context.scope['separator'];
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

const methods = {
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
};

const arrayMethods = entries => Object.keys(methods).reduce((acc, p) => ({ ...acc, [p]: methods[p](entries) }), {});

const arrayMembers = entries => ({
  length: createNumericValue(entries.length),
});

export const arrayProperties = entries => ({
  ...arrayMethods(entries),
  ...arrayMembers(entries),
});  
