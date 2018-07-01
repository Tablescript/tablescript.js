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

import { createValue } from './default';
import { valueTypes, isString } from './types';
import { createBooleanValue } from './boolean';
import { createUndefined } from './undefined';
import { stringProperties } from './string-properties';

const asNativeString = value => () => value;
const asNativeBoolean = value => () => value === '' ? false : true;
const nativeEquals = value => (context, other) => isString(other) && value === other.asNativeString(context);

const asString = asNativeString => context => createStringValue(asNativeString(context));
const asBoolean = asNativeBoolean => context => createBooleanValue(asNativeBoolean(context));
const equals = nativeEquals => (context, otherValue) => createBooleanValue(nativeEquals(context, otherValue));

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

const add = asNativeString => (context, otherValue) => {
  return createStringValue(asNativeString(context) + otherValue.asNativeString(context));
};

const multiplyBy = asNativeString => (context, otherValue) => {
  return createStringValue(asNativeString().repeat(otherValue.asNativeNumber()));
};

export const createStringValueWithProperties = (value, properties) => {
  return createValue(
    valueTypes.STRING,
    asNativeString(value),
    properties,
    {
      // native values
      asNativeString: asNativeString(value),
      asNativeBoolean: asNativeBoolean(value),
      nativeEquals: nativeEquals(value),
      // wrapped values
      asString: asString(asNativeString(value)),
      asBoolean: asBoolean(asNativeBoolean(value)),
      equals: equals(nativeEquals(value)),
      // elements and properties
      getElement: getElement(value),
      // operators
      add: add(asNativeString),
      multiplyBy: multiplyBy(asNativeString),
    },
  );
};

export const createStringValue = value => createStringValueWithProperties(value, stringProperties(value));
