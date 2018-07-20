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

/*

asNativeValue(context) : any<native>;
asNativeNumber(context) : number;
asNativeString(context) : string;
asNativeBoolean(context) : boolean;
asNativeArray(context) : array[any<native>];
asNativeObject(context) : object<string => any<native>];
nativeEquals(context, other : VALUE) : boolean;
asNumber(context) : NUMBER;
asString(context) : STRING;
asBoolean(context) : BOOLEAN;
asArray(context) : ARRAY<VALUE>;
asObject(context) : OBJECT;
getProperty(context, name : STRING) : VALUE | UNDEFINED;
setProperty(context, name : STRING, value : VALUE) : VALUE;
getElement(context, index : NUMBER) : VALUE | UNDEFINED;
callFunction(context, parameters : ARRAY<VALUE>) : Promise<VALUE>;
add(context, other : NUMBER | STRING) : NUMBER | STRING;
subtract(context, other) : NUMBER;
multiplyBy(context, other) : NUMBER;
divideBy(context, other) | NUMBER;
modulo(context, other) | NUMBER;
equals(context, other : VALUE) : BOOLEAN;
notEquals(context, other : VALUE) : BOOLEAN;
lessThan(context, other : VALUE) : BOOLEAN;
greaterThan(context, other : VALUE) : BOOLEAN;
lessThanOrEquals(context, other : VALUE) : BOOLEAN;
greaterThanOrEquals(context, other : VALUE) : BOOLEAN;

*/

import { valueTypeName } from './types';
import { runtimeErrorThrower } from '../error';
import { createUndefined } from './undefined';

const getProperty = properties => (context, name) => {
  const nameValue = name.asNativeString(context);
  if (properties[nameValue]) {
    return properties[nameValue];
  }
  return createUndefined();
};

const defaultMethods = (nativeValueFunction, properties, getTypeName) => ({
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
  getProperty: Object.keys(properties).length === 0 ? runtimeErrorThrower(`Cannot get property of ${getTypeName()}`) : getProperty(properties),
  setProperty: runtimeErrorThrower(`Cannot set property of ${getTypeName()}`),
  getElement: runtimeErrorThrower(`Cannot get element of ${getTypeName()}`),
  callFunction: runtimeErrorThrower(`${getTypeName()} is not callable`),
  add: runtimeErrorThrower(`Cannot add to ${getTypeName()}`),
  subtract: runtimeErrorThrower(`Cannot subtract from ${getTypeName()}`),
  multiplyBy: runtimeErrorThrower(`Cannot multiply ${getTypeName()}`),
  divideBy: runtimeErrorThrower(`Cannot divide ${getTypeName()}`),
  modulo: runtimeErrorThrower(`Cannot modulo ${getTypeName()}`),
  equals: runtimeErrorThrower(`Cannot determine equality with ${getTypeName()}`),
  notEquals: runtimeErrorThrower(`Cannot determine inequality with ${getTypeName()}`),
  lessThan: runtimeErrorThrower(`Cannot compare (<) with ${getTypeName()}`),
  greaterThan: runtimeErrorThrower(`Cannot compare (>) with ${getTypeName()}`),
  lessThanOrEquals: runtimeErrorThrower(`Cannot compare (<=) with ${getTypeName()}`),
  greaterThanOrEquals: runtimeErrorThrower(`Cannot compare (>=) with ${getTypeName()}`),
});

export const createValue = (type, nativeValueFunction, properties, methods) => ({
  type,
  ...defaultMethods(nativeValueFunction, properties, () => valueTypeName(type)),
  ...methods,
});
