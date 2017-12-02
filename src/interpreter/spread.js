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

export const createArraySpread = a => {
  return {
    type: valueTypes.ARRAY_SPREAD,
    asNativeValue: runtimeErrorThrower('Cannot convert spread to native value'),
    asNativeNumber: runtimeErrorThrower('Cannot convert spread to native number'),
    asNativeString: runtimeErrorThrower('Cannot convert spread to native string'),
    asNativeBoolean: runtimeErrorThrower('Cannot convert spread to native boolean'),
    asNativeArray: runtimeErrorThrower('Cannot convert spread to native array'),
    equals: runtimeErrorThrower('Cannot compare with spread'),
    asNumber: runtimeErrorThrower('Cannot convert spread to number'),
    asString: runtimeErrorThrower('Cannot convert spread to string'),
    asBoolean: runtimeErrorThrower('Cannot convert spread to boolean'),
    getProperty: runtimeErrorThrower('Cannot get property of spread'),
    setProperty: runtimeErrorThrower('Cannot set property of spread'),
    getProperties: runtimeErrorThrower('Cannot get properties of array spread'),
    getElement: runtimeErrorThrower('Cannot get element of spread'),
    getElements: () => a.getElements(),
    callFunction: runtimeErrorThrower('Cannot call an array spread'),
  };
};

export const createObjectSpread = o => {
  return {
    type: valueTypes.OBJECT_SPREAD,
    asNativeValue: runtimeErrorThrower('Cannot convert spread to native value'),
    asNativeNumber: runtimeErrorThrower('Cannot convert spread to native number'),
    asNativeString: runtimeErrorThrower('Cannot convert spread to native string'),
    asNativeBoolean: runtimeErrorThrower('Cannot convert spread to native boolean'),
    asNativeArray: runtimeErrorThrower('Cannot convert spread to native array'),
    equals: runtimeErrorThrower('Cannot compare with spread'),
    asNumber: runtimeErrorThrower('Cannot convert spread to number'),
    asString: runtimeErrorThrower('Cannot convert spread to string'),
    asBoolean: runtimeErrorThrower('Cannot convert spread to boolean'),
    getProperty: runtimeErrorThrower('Cannot get property of spread'),
    setProperty: runtimeErrorThrower('Cannot set property of spread'),
    getProperties: () => o.getProperties(),
    getElement: runtimeErrorThrower('Cannot get element of spread'),
    getElements: runtimeErrorThrower('Cannot get elements of object spread'),
    callFunction: runtimeErrorThrower('Cannot call an object spread'),
  };
};
