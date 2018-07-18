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
import { valueTypes, isString } from './types';
import { stringProperties } from './string-properties';
import { createBooleanValue } from './boolean';
import { createUndefined } from './undefined';

const asNativeString = value => () => value;
const asNativeBoolean = value => () => value === '' ? false : true;
const nativeEquals = value => (location, other) => isString(other) && value === other.asNativeString(location);

const asString = asNativeString => location => createStringValue(asNativeString(location));
const asBoolean = asNativeBoolean => location => createBooleanValue(asNativeBoolean(location));
const equals = nativeEquals => (location, other) => createBooleanValue(nativeEquals(location, other));
const notEquals = nativeEquals => (location, other) => createBooleanValue(!nativeEquals(location, other));

const getElement = value => (location, index) => {
  let indexValue = index.asNativeNumber(location);
  if (indexValue < 0) {
    indexValue = value.length + indexValue;
  }
  if (indexValue < 0 || indexValue >= value.length) {
    return createUndefined();
  }
  return createStringValue(value[indexValue]);
};

const add = asNativeString => (location, other) => createStringValue(asNativeString(location) + other.asNativeString(location));
const multiplyBy = asNativeString => (location, other) => createStringValue(asNativeString(location).repeat(other.asNativeNumber(location)));

const methods = {
  asNativeString,
  asNativeBoolean,
  nativeEquals,
  asString: R.pipe(asNativeString, asString),
  asBoolean: R.pipe(asNativeBoolean, asBoolean),
  equals: R.pipe(nativeEquals, equals),
  notEquals: R.pipe(nativeEquals, notEquals),
  getElement,
  add: R.pipe(asNativeString, add),
  multiplyBy: R.pipe(asNativeString, multiplyBy),
};

export const stringMethods = value => Object.keys(methods).reduce((acc, m) => ({ ...acc, [m]: methods[m](value) }), {});

export const createCustomStringValue = (value, properties) => createValue(
  valueTypes.STRING,
  asNativeString(value),
  properties,
  stringMethods(value),
);

export const createStringValue = value => createCustomStringValue(value, stringProperties(value));
