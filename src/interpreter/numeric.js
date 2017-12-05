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
import { createNativeFunctionValue } from './function';
import { createArrayValue } from './array';
import { createUndefined } from './undefined';

export const createNumericValue = value => {
  const asNativeNumber = () => value;
  const asNativeString = () => value.toString();
  const asNativeBoolean = () => value == 0 ? false : true;
  const equals = (context, other) => value === other.asNativeNumber(context);
  const asNumber = context => createNumericValue(asNativeNumber(context));
  const asString = context => createStringValue(asNativeString(context));
  const asBoolean = context => createBooleanValue(asNativeBoolean(context));

  return {
    type: valueTypes.NUMBER,
    asNativeValue: asNativeNumber,
    asNativeNumber,
    asNativeString,
    asNativeBoolean,
    equals,
    asNumber,
    asString,
    asBoolean,
    getProperty: runtimeErrorThrower('Cannot get property of numeric'),
    setProperty: runtimeErrorThrower('Cannot set property on numeric'),
    getElement: runtimeErrorThrower('Cannot get element of numeric'),
    callFunction: runtimeErrorThrower('Cannot call numeric'),
  };
};
