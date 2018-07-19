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
import { valueTypes, isArray } from './types';
import { arrayProperties } from './array-properties';
import { throwRuntimeError } from '../error';
import { createBooleanValue } from './boolean';
import { createStringValue } from './string';
import { createUndefined } from './undefined';

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
const setProperty = entries => (context, index, value) => {
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
const getElement = entries => (context, index) => {
  let indexValue = index.asNativeNumber(context);
  if (indexValue < 0) {
    indexValue = entries.length + indexValue;
  }
  if (indexValue < 0 || indexValue >= entries.length) {
    return createUndefined();
  }
  return entries[indexValue];
};
const add = entries => (context, other) => createArrayValue([...entries, other]);
const multiplyBy = entries => (context, other) => createArrayValue(R.range(0, other.asNativeNumber(context)).reduce((all,n) => ([...all, ...entries]), []));
const equals = nativeEquals => (context, other) => createBooleanValue(nativeEquals(context, other));
const notEquals = nativeEquals => (context, other) => createBooleanValue(!nativeEquals(context, other));

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
