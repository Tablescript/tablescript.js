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
import { valueTypes } from './types';
import { createBooleanValue } from './boolean';
import { createNumericValue } from './numeric';
import { createArrayValue } from './array';
import { createNativeFunctionValue } from './function';
import { createStringValue } from './string';

const split = value => (location, scope) => {
  const separator = scope['separator'];
  if (separator) {
    if (separator.type !== valueTypes.STRING) {
      throwRuntimeError(`split(separator) separator must be a string`, location);
    }
    return createArrayValue(value.split(separator.asNativeString(location)).map(s => createStringValue(s)));
  }
  return createArrayValue(value.split().map(s => createStringValue(s)));
};

const capitalize = value => () => createStringValue(value.length === 0 ? value : value[0].toUpperCase() + value.slice(1));
const uppercase = value => () => createStringValue(value.toUpperCase());
const lowercase = value => () => createStringValue(value.toLowerCase());

const includes = value => (location, scope) => {
  const s = scope['s'];
  if (s.type !== valueTypes.STRING) {
    throwRuntimeError(`includes(s) s must be a string`, location);
  }
  return createBooleanValue(value.includes(s.asNativeString(location)));
};

const indexOf = value => (location, scope) => {
  const s = scope['s'];
  if (s.type !== valueTypes.STRING) {
    throwRuntimeError(`indexOf(s) s must be a string`, location);
  }
  return createNumericValue(value.indexOf(s.asNativeString(location)));
};

const slice = value => (location, scope) => {
  const startValue = scope['start'];
  if (!startValue || startValue.type !== valueTypes.NUMBER) {
    throwRuntimeError(`slice(start, end) start must be a number`, location);
  }
  const endValue = scope['end'];
  if (endValue) {
    if (endValue.type !== valueTypes.NUMBER) {
      throwRuntimeError(`slice(start, end) end must be a number`, location);
    }
    return createStringValue(value.slice(startValue.asNativeNumber(location), endValue.asNativeNumber(location)));
  }
  return createStringValue(value.slice(startValue.asNativeNumber(location)));
};

const startsWith = value => (location, scope) => {
  const s = scope['s'];
  if (s.type !== valueTypes.STRING) {
    throwRuntimeError(`startsWith(s) s must be a string`, location);
  }
  return createBooleanValue(value.startsWith(s.asNativeString(location)));
};

const endsWith = value => (location, scope) => {
  const s = scope['s'];
  if (s.type !== valueTypes.STRING) {
    throwRuntimeError(`endsWith(s) s must be a string`, location);
  }
  return createBooleanValue(value.endsWith(s.asNativeString(location)));
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
