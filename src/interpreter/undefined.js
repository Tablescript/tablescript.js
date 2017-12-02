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

import { valueTypes } from './types';
import { runtimeErrorThrower } from '../error';
import { createStringValue } from './string';
import { createBooleanValue } from './boolean';

export const createUndefined = () => {
  const asNativeValue = () => undefined;
  const asNativeString = () => 'undefined';
  const asNativeBoolean = () => false;
  const asString = context => createStringValue(asNativeString(context));
  const asBoolean = context => createBooleanValue(asNativeBoolean(context));

  return {
    type: valueTypes.UNDEFINED,
    asNativeValue,
    asNativeNumber: runtimeErrorThrower('Cannot cast undefined to numeric'),
    asNativeString,
    asNativeBoolean,
    equals: (context, other) => other.type === valueTypes.UNDEFINED,
    asNumber: runtimeErrorThrower('Cannot cast undefined to numeric'),
    asString,
    asBoolean,
    getProperty: runtimeErrorThrower('Cannot get property of undefined'),
    setProperty: runtimeErrorThrower('Cannot set property of undefined'),
    getElement: runtimeErrorThrower('Cannot get element of undefined'),
    callFunction: runtimeErrorThrower('Cannot call undefined'),
  };
};
