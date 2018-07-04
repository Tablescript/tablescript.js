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
import { isString } from './types';
import { createBooleanValue } from './boolean';
import { createUndefined } from './undefined';
import { createStringValue } from './string';

const asNativeString = value => () => value;
const asNativeBoolean = value => () => value === '' ? false : true;
const nativeEquals = value => (context, other) => isString(other) && value === other.asNativeString(context);

const asString = asNativeString => context => createStringValue(asNativeString(context));
const asBoolean = asNativeBoolean => context => createBooleanValue(asNativeBoolean(context));
const equals = nativeEquals => (context, other) => createBooleanValue(nativeEquals(context, other));
const notEquals = nativeEquals => (context, other) => createBooleanValue(!nativeEquals(context, other));

const getElement = value => (context, index) => {
  let indexValue = index.asNativeNumber(context);
  if (indexValue < 0) {
    indexValue = value.length + indexValue;
  }
  if (indexValue < 0 || indexValue >= value.length) {
    return createUndefined();
  }
  return createStringValue(value[indexValue]);
};

const add = asNativeString => (context, other) => createStringValue(asNativeString(context) + other.asNativeString(context));
const multiplyBy = asNativeString => (context, other) => createStringValue(asNativeString(context).repeat(other.asNativeNumber(context)));

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

export const asNativeValue = value => asNativeString(value);
