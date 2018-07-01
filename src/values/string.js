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
import { stringProperties } from './string-members';

export const createStringValueWithProperties = (value, properties) => {

  // native values
  const asNativeString = () => value;
  const asNativeBoolean = () => value === '' ? false : true;
  const nativeEquals = (context, other) => isString(other) && value === other.asNativeString(context);

  // wrapped values
  const asString = context => createStringValue(asNativeString(context));
  const asBoolean = context => createBooleanValue(asNativeBoolean(context));
  const equals = (context, otherValue) => createBooleanValue(nativeEquals(context, otherValue));
  
  // elements and properties
  const getElement = (context, index) => {
    let indexValue = index.asNativeNumber(context);
    if (indexValue < 0) {
      indexValue = value.length + indexValue;
    }
    if (indexValue < 0 || indexValue >= value.length) {
      return createUndefined();
    }
    return createStringValue(value[indexValue]);
  };

  // operators
  const add = (context, otherValue) => {
    return createStringValue(asNativeString(context) + otherValue.asNativeString(context));
  };
  const multiplyBy = (context, otherValue) => {
    return createStringValue(asNativeString().repeat(otherValue.asNativeNumber()));
  };

  return createValue(
    valueTypes.STRING,
    asNativeString,
    properties,
    {
      // native values
      asNativeString,
      asNativeBoolean,
      nativeEquals,
      // wrapped values
      asString,
      asBoolean,
      equals,
      // elements and properties
      getElement,
      // operators
      add,
      multiplyBy,
    },
  );
};

export const createStringValue = value => createStringValueWithProperties(value, stringProperties(value));
