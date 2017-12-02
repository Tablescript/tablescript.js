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

import { runtimeErrorThrower } from '../error';
import { valueTypes } from './types';
import { createNumericValue } from './numeric';
import { createStringValue } from './string';

export const createBooleanValue = value => {
  const asNativeNumber = () => value ? 1 : 0;
  const asNativeString = () => value ? 'true' : 'false';
  const asNativeBoolean = () => value;
  const equals = (context, other) => value === other.asNativeBoolean(context);
  const asNumber = context => createNumericValue(asNativeNumber(context));
  const asString = context => createStringValue(asNativeString(context));
  const asBoolean = () => createBooleanValue(value);

  return {
    type: valueTypes.BOOLEAN,
    asNativeValue: asNativeBoolean,
    asNativeNumber,
    asNativeString,
    asNativeBoolean,
    asNativeArray: runtimeErrorThrower('Cannot convert boolean to array'),
    equals,
    asNumber,
    asString,
    asBoolean,
    getProperty: runtimeErrorThrower('Cannot get property of boolean'),
    setProperty: runtimeErrorThrower('Cannot set property of boolean'),
    getProperties: runtimeErrorThrower('Cannot get properties of boolean'),
    getElement: runtimeErrorThrower('Cannot get element of boolean'),
    getElements: runtimeErrorThrower('Cannot get elements of boolean'),
    callFunction: runtimeErrorThrower('Cannot call boolean'),
  };
};
