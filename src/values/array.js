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
import { valueTypes } from './types';
import { arrayProperties } from './array-properties';
import { throwRuntimeError } from '../error';
import { createBooleanValue } from './boolean';
import { createStringValue } from './string';
import { createUndefined } from './undefined';

const entriesAsNativeValues = (location, entries) => entries.map(e => e.asNativeValue(location));
const asNativeString = entries => location => JSON.stringify(entriesAsNativeValues(location, entries));
const asNativeBoolean = () => () => true;
const asNativeArray = entries => location => entriesAsNativeValues(location, entries);
const nativeEquals = entries => (location, other) => {
  if (other.type !== valueTypes.ARRAY) {
    return false;
  }
  const otherEntries = other.asArray();
  if (otherEntries.length !== entries.length) {
    return false;
  }
  return entries.reduce((result, entry, index) => result && entry.nativeEquals(location, otherEntries[index]), true);
};
const asString = asNativeString => location => createStringValue(asNativeString(location));
const asBoolean = asNativeBoolean => () => createBooleanValue(asNativeBoolean());
const asArray = entries => () => entries;
const setProperty = entries => (location, index, value) => {
  let indexValue = index.asNativeNumber(location);
  if (indexValue < 0) {
    indexValue = entries.length + indexValue;
  }
  if (indexValue < 0 || indexValue >= entries.length) {
    throwRuntimeError('Index out of range', location);
  }
  entries[indexValue] = value;
  return value;
};
const getElement = entries => (location, index) => {
  let indexValue = index.asNativeNumber(location);
  if (indexValue < 0) {
    indexValue = entries.length + indexValue;
  }
  if (indexValue < 0 || indexValue >= entries.length) {
    return createUndefined();
  }
  return entries[indexValue];
};
const add = entries => (location, other) => createArrayValue([...entries, other]);
const multiplyBy = entries => (location, other) => createArrayValue(R.range(0, other.asNativeNumber(location)).reduce((all,n) => ([...all, ...entries]), []));
const equals = nativeEquals => (location, other) => createBooleanValue(nativeEquals(location, other));
const notEquals = nativeEquals => (location, other) => createBooleanValue(!nativeEquals(location, other));

const methods = {
  asNativeString,
  asNativeBoolean,
  asNativeArray,
  nativeEquals,
  asString: R.pipe(asNativeString, asString),
  asBoolean: R.pipe(asNativeBoolean, asBoolean),
  asArray,
  setProperty,
  getElement,
  add,
  multiplyBy,
  equals: R.pipe(nativeEquals, equals),
  notEquals: R.pipe(nativeEquals, notEquals),
};

export const arrayMethods = entries => Object.keys(methods).reduce((acc, m) => ({ ...acc, [m]: methods[m](entries) }), {});

export const createCustomArrayValue = (entries, properties) => createValue(
  valueTypes.ARRAY,
  asNativeArray(entries),
  properties,
  arrayMethods(entries),
);

export const createArrayValue = entries => createCustomArrayValue(entries, arrayProperties(entries));
