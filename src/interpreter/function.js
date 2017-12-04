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
import { createStringValue } from './string';
import { createBooleanValue } from './boolean';

const validateCalledParameters = (formalParameters, calledParameters) => {
  if (calledParameters.length > formalParameters.length) {
    throwRuntimeError(`function call expected ${formalParameters.length} parameters but got ${calledParameters.length}`);
  }
  return calledParameters;
};

const toKeyValuePair = formalParameters => (value, index) => ({ [formalParameters[index]]: value });
const keyPairsToObject = (result, pair) => ({
  ...result,
  ...pair
});

const parameterConverter = formalParameters => calledParameters => {
  return validateCalledParameters(formalParameters, calledParameters)
    .map(toKeyValuePair(formalParameters))
    .reduce(keyPairsToObject, {});
};

export const createNativeFunctionValue = (formalParameters, f) => {
  const parametersToArguments = parameterConverter(formalParameters);

  const asNativeString = () => 'function(native)';
  const asNativeBoolean = () => true;
  const asString = context => createStringValue(asNativeString(context));
  const asBoolean = context => createBooleanValue(asNativeBoolean(context));
  const equals = other => false;
  const callFunction = async (context, scope, parameters) => {
    const localScope = {
      ...scope,
      ...parametersToArguments(parameters)
    };
    return await f(context, localScope);
  };

  return {
    type: valueTypes.FUNCTION,
    asNativeValue: asNativeString,
    asNativeNumber: runtimeErrorThrower('Cannot cast function to number'),
    asNativeString,
    asNativeBoolean,
    equals,
    asNumber: runtimeErrorThrower('Cannot cast function to number'),
    asString,
    asBoolean,
    getProperty: runtimeErrorThrower('Cannot get property of native function'),
    setProperty: runtimeErrorThrower('Cannot set property of native function'),
    getElement: runtimeErrorThrower('Cannot get element of native function'),
    callFunction,
  };
};

export const createFunctionValue = (formalParameters, body, closure) => {
  const parametersToArguments = parameterConverter(formalParameters);

  const asNativeString = () => 'function';
  const asNativeBoolean = () => true;
  const asString = context => createStringValue(asNativeString(context));
  const asBoolean = context => createBooleanValue(asNativeBoolean(context));
  const equals = other => false;
  const callFunction = async (context, scope, parameters) => {
    const localScope = {
      ...scope,
      ...closure,
      ...parametersToArguments(parameters)
    };
    return await body.evaluate(localScope);
  };

  return {
    type: valueTypes.FUNCTION,
    asNativeValue: asNativeString,
    asNativeNumber: runtimeErrorThrower('Cannot cast function to number'),
    asNativeString,
    asNativeBoolean,
    equals,
    asNumber: runtimeErrorThrower('Cannot cast function to number'),
    asString,
    asBoolean,
    getProperty: runtimeErrorThrower('Cannot get property of function'),
    setProperty: runtimeErrorThrower('Cannot set property of function'),
    getElement: runtimeErrorThrower('Cannot get element of function'),
    callFunction,
  };
};
