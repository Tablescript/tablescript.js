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

import { valueTypeName } from './types';
import { runtimeErrorThrower } from '../error';

const defaultMethods = (nativeValueFunction, getTypeName) => ({
  asNativeValue: nativeValueFunction,
  asNativeNumber: runtimeErrorThrower(`Cannot cast ${getTypeName()} to number`),
  asNativeString: runtimeErrorThrower(`Cannot cast ${getTypeName()} to string`),
  asNativeBoolean: runtimeErrorThrower(`Cannot cast ${getTypeName()} to boolean`),
  asNativeArray: runtimeErrorThrower(`Cannot cast ${getTypeName()} to array`),
  asNativeObject: runtimeErrorThrower(`Cannot cast ${getTypeName()} to object`),
  nativeEquals: runtimeErrorThrower(`${getTypeName()} equality unimplemented`),
  asNumber: runtimeErrorThrower(`Cannot cast ${getTypeName()} to number`),
  asString: runtimeErrorThrower(`Cannot cast ${getTypeName()} to string`),
  asBoolean: runtimeErrorThrower(`Cannot cast ${getTypeName()} to boolean`),
  asArray: runtimeErrorThrower(`Cannot cast ${getTypeName()} to array`),
  asObject: runtimeErrorThrower(`Cannot cast ${getTypeName()} to object`),
  getProperty: runtimeErrorThrower(`Cannot get property of ${getTypeName()}`),
  setProperty: runtimeErrorThrower(`Cannot set property of ${getTypeName()}`),
  getElement: runtimeErrorThrower(`Cannot get element of ${getTypeName()}`),
  callFunction: runtimeErrorThrower(`${getTypeName()} is not callable`),
  add: runtimeErrorThrower(`Cannot add to ${getTypeName()}`),
  subtract: runtimeErrorThrower(`Cannot subtract from ${getTypeName()}`),
  multiplyBy: runtimeErrorThrower(`Cannot multiply ${getTypeName()}`),
  divideBy: runtimeErrorThrower(`Cannot divide ${getTypeName()}`),
  modulo: runtimeErrorThrower(`Cannot modulo ${getTypeName()}`),
  equals: runtimeErrorThrower(`Cannot determine equality with ${getTypeName()}`),
});

export const createValue = (type, nativeValueFunction, methods) => ({
  type,
  ...defaultMethods(nativeValueFunction, () => valueTypeName(type)),
  ...methods,
});

export const defaultValue = (type, nativeValueFunction) => {
  const typeName = valueTypeName(type);
  
  return {
    type,
    asNativeValue: nativeValueFunction,
    asNativeNumber: runtimeErrorThrower(`Cannot cast ${typeName} to number`),
    asNativeString: runtimeErrorThrower(`Cannot cast ${typeName} to string`),
    asNativeBoolean: runtimeErrorThrower(`Cannot cast ${typeName} to boolean`),
    asNativeArray: runtimeErrorThrower(`Cannot cast ${typeName} to array`),
    asNativeObject: runtimeErrorThrower(`Cannot cast ${typeName} to object`),
    nativeEquals: runtimeErrorThrower(`${typeName} equality unimplemented`),
    asNumber: runtimeErrorThrower(`Cannot cast ${typeName} to number`),
    asString: runtimeErrorThrower(`Cannot cast ${typeName} to string`),
    asBoolean: runtimeErrorThrower(`Cannot cast ${typeName} to boolean`),
    asArray: runtimeErrorThrower(`Cannot cast ${typeName} to array`),
    asObject: runtimeErrorThrower(`Cannot cast ${typeName} to object`),
    getProperty: runtimeErrorThrower(`Cannot get property of ${typeName}`),
    setProperty: runtimeErrorThrower(`Cannot set property of ${typeName}`),
    getElement: runtimeErrorThrower(`Cannot get element of ${typeName}`),
    callFunction: runtimeErrorThrower(`${typeName} is not callable`),
    add: runtimeErrorThrower(`Cannot add to ${typeName}`),
    subtract: runtimeErrorThrower(`Cannot subtract from ${typeName}`),
    multiplyBy: runtimeErrorThrower(`Cannot multiply ${typeName}`),
    divideBy: runtimeErrorThrower(`Cannot divide ${typeName}`),
    modulo: runtimeErrorThrower(`Cannot modulo ${typeName}`),
    equals: runtimeErrorThrower(`Cannot determine equality with ${typeName}`),
  };
};
