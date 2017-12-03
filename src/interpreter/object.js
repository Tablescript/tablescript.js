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
import { createStringValue } from './string';
import { createArrayValue } from './array';
import { createNativeFunctionValue } from './function';
import { createUndefined } from './undefined';

export const createObjectValue = o => {
  const asNativeString = context => {
    return JSON.stringify(Object.keys(o).reduce((acc, key) => ({...acc, [key]: o[key].asNativeValue(context) }), {}));
  };
  const asNativeBoolean = () => true;
  const asNativeObject = context => Object.keys(o).reduce((acc, key) => ({...acc, [key]: o[key].asNativeValue(context) }), {});
  const asString = context => createStringValue(asNativeString(context));
  const asBoolean = context => createBooleanValue(asNativeBoolean(context));
  const getProperty = (context, name) => {
    const propertyName = name.asNativeString(context);
    if (members[propertyName]) {
      return members[propertyName];
    }
    if (o[propertyName]) {
      return o[propertyName];
    }
    return createUndefined();
  };
  const setProperty = (context, name, value) => {
    o[name.asNativeString(context)] = value;
  };

  const members = {
    keys: createNativeFunctionValue([], (context, scope) => createArrayValue(Object.keys(o).map(key => createStringValue(key)))),
  };

  return {
    type: valueTypes.OBJECT,
    asNativeValue: asNativeObject,
    asNativeNumber: runtimeErrorThrower('Cannot cast object to number'),
    asNativeString,
    asNativeBoolean,
    asNativeObject,
    equals: runtimeErrorThrower('Object equality unimplemented'),
    asNumber: runtimeErrorThrower('Cannot cast object to number'),
    asString,
    asBoolean,
    getProperty,
    setProperty,
    getProperties: () => o,
    getElement: runtimeErrorThrower('Cannot get element of object'),
    callFunction: runtimeErrorThrower('Cannot call object'),
  };
};
