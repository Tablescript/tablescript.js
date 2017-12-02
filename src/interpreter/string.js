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
import { createBooleanValue } from './boolean';
import { createNumericValue } from './numeric';
import { createUndefined } from './undefined';

export const createStringValue = value => {
  const asNativeNumber = () => Number(value);
  const asNativeString = () => value;
  const asNativeBoolean = () => value === '' ? false : true;
  const equals = (context, other) => value === other.asNativeString(context);
  const asNumber = context => createNumericValue(asNativeNumber(context));
  const asString = context => createStringValue(asNativeString(context));
  const asBoolean = context => createBooleanValue(asNativeBoolean(context));
  const getProperty = (context, name) => {
    const nameValue = name.asNativeString(context);
    if (members[nameValue]) {
      return members[nameValue];
    }
    throwRuntimeError(`String has no member ${nameValue}`, context);
  };
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

  const members = {
    empty: createBooleanValue(value.length === 0),
    length: createNumericValue(value.length),
  };

  return {
    type: valueTypes.STRING,
    asNativeValue: asNativeString,
    asNativeNumber,
    asNativeString,
    asNativeBoolean,
    equals,
    asNumber,
    asString,
    asBoolean,
    getProperty,
    setProperty: runtimeErrorThrower('Cannot set property on string'),
    getElement,
    callFunction: runtimeErrorThrower('Cannot call string'),
  };
};
