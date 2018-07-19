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

import { throwRuntimeError } from '../error';
import { isString, isNumber } from './types';
import { createBooleanValue } from './boolean';
import { createNumericValue } from './numeric';
import { createArrayValue } from './array';
import { createNativeFunctionValue } from './function';
import { createStringValue } from './string';

const split = value => context => {
  const separator = context.scope['separator'];
  if (separator) {
    if (!isString(separator)) {
      throwRuntimeError(`split(separator) separator must be a string`, context);
    }
    return createArrayValue(value.split(separator.asNativeString(context)).map(s => createStringValue(s)));
  }
  return createArrayValue(value.split().map(s => createStringValue(s)));
};

const capitalize = value => () => createStringValue(value.length === 0 ? value : value[0].toUpperCase() + value.slice(1));
const uppercase = value => () => createStringValue(value.toUpperCase());
const lowercase = value => () => createStringValue(value.toLowerCase());

const includes = value => context => {
  const s = context.scope['s'];
  if (!isString(s)) {
    throwRuntimeError(`includes(s) s must be a string`, context);
  }
  return createBooleanValue(value.includes(s.asNativeString(context)));
};

const indexOf = value => context => {
  const s = context.scope['s'];
  if (!isString(s)) {
    throwRuntimeError(`indexOf(s) s must be a string`, context);
  }
  return createNumericValue(value.indexOf(s.asNativeString(context)));
};

const slice = value => context => {
  const startValue = context.scope['start'];
  if (!startValue || !isNumber(startValue)) {
    throwRuntimeError(`slice(start, end) start must be a number`, context);
  }
  const endValue = context.scope['end'];
  if (endValue) {
    if (!isNumber(endValue)) {
      throwRuntimeError(`slice(start, end) end must be a number`, context);
    }
    return createStringValue(value.slice(startValue.asNativeNumber(context), endValue.asNativeNumber(context)));
  }
  return createStringValue(value.slice(startValue.asNativeNumber(context)));
};

const startsWith = value => context => {
  const s = context.scope['s'];
  if (!isString(s)) {
    throwRuntimeError(`startsWith(s) s must be a string`, context);
  }
  return createBooleanValue(value.startsWith(s.asNativeString(context)));
};

const endsWith = value => context => {
  const s = context.scope['s'];
  if (!isString(s)) {
    throwRuntimeError(`endsWith(s) s must be a string`, context);
  }
  return createBooleanValue(value.endsWith(s.asNativeString(context)));
};

const trim = value => () => createStringValue(value.trim());
const trimLeft = value => () => createStringValue(value.trimLeft());
const trimRight = value => () => createStringValue(value.trimRight());

const methods = {
  split: [split, ['separator']],
  capitalize,
  uppercase,
  lowercase,
  includes: [includes, ['s']],
  indexOf: [indexOf, ['s']],
  slice: [slice, ['start', 'end']],
  startsWith: [startsWith, ['s']],
  endsWith: [endsWith, ['s']],
  trim,
  trimLeft,
  trimRight,
};

const buildMethod = (m, value) => {
  if (typeof m === 'function') {
    return createNativeFunctionValue([], m(value));
  }
  return createNativeFunctionValue(m[1], m[0](value));
};

const stringMethods = value => Object.keys(methods)
  .reduce((acc, m) => ({ ...acc, [m]: buildMethod(methods[m], value) }), {});

const stringMembers = value => ({
  empty: createBooleanValue(value.length === 0),
  length: createNumericValue(value.length),
});

export const stringProperties = value => ({
  ...stringMethods(value),
  ...stringMembers(value),
});
