// Copyright 2019 Jamie Hale
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

asNativeValue() : any<native>;
identicalTo(other) : boolean;
asNativeNumber() : number;
asNativeString() : string;
asNativeBoolean() : boolean;
asNativeArray() : array[any<native>];
asNativeObject() : object<string => any<native>];
nativeEquals(other : VALUE) : boolean;
asArray() : array<VALUE>;
asObject(context) : object<string => VALUE>;;
getProperty(context, name : STRING) : VALUE | UNDEFINED;
setProperty(context, name : STRING, value : VALUE) : VALUE;
getElement(context, index : NUMBER) : VALUE | UNDEFINED;
callFunction(context, parameters : ARRAY<VALUE>) : <VALUE>;
add(context, other : NUMBER | STRING) : NUMBER | STRING;
subtract(context, other) : NUMBER;
multiplyBy(context, other) : NUMBER;
divideBy(context, other) | NUMBER;
modulo(context, other) | NUMBER;
lessThan(context, other : VALUE) : BOOLEAN;
greaterThan(context, other : VALUE) : BOOLEAN;
lessThanOrEquals(context, other : VALUE) : BOOLEAN;
greaterThanOrEquals(context, other : VALUE) : BOOLEAN;
compare(context, other : VALUE) : NUMBER;

*/

import { valueTypeName } from './types';
import { runtimeErrorThrower } from '../error';

const getProperty = properties => (context, name) => {
  const nameValue = name.asNativeString();
  if (properties[nameValue]) {
    return properties[nameValue];
  }
  return context.factory.createUndefined();
};

const defaultMethods = (asNativeValue, identicalTo, nativeEquals, properties, getTypeName) => ({
  asNativeValue,
  identicalTo,
  nativeEquals,
  asNativeNumber: runtimeErrorThrower(`Cannot treat ${getTypeName()} as NUMBER`),
  asNativeString: runtimeErrorThrower(`Cannot treat ${getTypeName()} as STRING`),
  asNativeBoolean: runtimeErrorThrower(`Cannot treat ${getTypeName()} as BOOLEAN`),
  asNativeArray: runtimeErrorThrower(`Cannot treat ${getTypeName()} as ARRAY`),
  asNativeObject: runtimeErrorThrower(`Cannot treat ${getTypeName()} as OBJECT`),
  asArray: runtimeErrorThrower(`Cannot treat ${getTypeName()} as ARRAY`),
  asObject: runtimeErrorThrower(`Cannot treat ${getTypeName()} as OBJECT`),
  getProperty: Object.keys(properties).length === 0 ? runtimeErrorThrower(`Cannot get property of ${getTypeName()}`) : getProperty(properties),
  setProperty: runtimeErrorThrower(`Cannot set property of ${getTypeName()}`),
  getElement: runtimeErrorThrower(`Cannot get element of ${getTypeName()}`),
  callFunction: runtimeErrorThrower(`${getTypeName()} is not callable`),
  add: runtimeErrorThrower(`Cannot add to ${getTypeName()}`),
  subtract: runtimeErrorThrower(`Cannot subtract from ${getTypeName()}`),
  multiplyBy: runtimeErrorThrower(`Cannot multiply ${getTypeName()}`),
  divideBy: runtimeErrorThrower(`Cannot divide ${getTypeName()}`),
  modulo: runtimeErrorThrower(`Cannot modulo ${getTypeName()}`),
  lessThan: runtimeErrorThrower(`Cannot compare (<) with ${getTypeName()}`),
  greaterThan: runtimeErrorThrower(`Cannot compare (>) with ${getTypeName()}`),
  lessThanOrEquals: runtimeErrorThrower(`Cannot compare (<=) with ${getTypeName()}`),
  greaterThanOrEquals: runtimeErrorThrower(`Cannot compare (>=) with ${getTypeName()}`),
  compare: runtimeErrorThrower(`Cannot compare with ${getTypeName()}`),
});

export const createValue = (type, nativeValueFunction, identicalToFunction, nativeEqualsFunction, properties, methods) => ({
  type,
  typeName: valueTypeName(type),
  value: nativeValueFunction(),
  ...defaultMethods(nativeValueFunction, identicalToFunction, nativeEqualsFunction, properties, () => valueTypeName(type)),
  ...methods,
});
