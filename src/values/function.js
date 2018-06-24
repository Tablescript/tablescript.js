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

import { throwRuntimeError } from '../error';
import { defaultValue } from './default';
import { valueTypes } from './types';
import { createStringValue } from './string';
import { createBooleanValue } from './boolean';

const toKeyValuePair = formalParameters => (value, index) => ({ [formalParameters[index]]: value });
const keyPairsToObject = (result, pair) => ({
  ...result,
  ...pair
});

const parameterConverter = formalParameters => calledParameters => {
  return calledParameters
    .map(toKeyValuePair(formalParameters))
    .reduce(keyPairsToObject, {});
};

export const createNativeFunctionValue = (formalParameters, f) => {
  const parametersToArguments = parameterConverter(formalParameters);

  const asNativeString = () => 'function(native)';
  const asNativeBoolean = () => true;
  const equals = other => false;
  const asString = context => createStringValue(asNativeString(context));
  const asBoolean = context => createBooleanValue(asNativeBoolean(context));
  const callFunction = async (context, scope, parameters) => {
    const localScope = {
      ...scope,
      ...parametersToArguments(parameters)
    };
    return await f(context, localScope);
  };

  return {
    ...defaultValue(valueTypes.FUNCTION, asNativeString),
    asNativeString,
    asNativeBoolean,
    equals,
    asString,
    asBoolean,
    callFunction,
  };
};

export const createFunctionValue = (formalParameters, body, closure) => {
  const parametersToArguments = parameterConverter(formalParameters);

  const asNativeString = () => 'function';
  const asNativeBoolean = () => true;
  const equals = other => false;
  const asString = context => createStringValue(asNativeString(context));
  const asBoolean = context => createBooleanValue(asNativeBoolean(context));
  const callFunction = async (context, scope, parameters) => {
    const localScope = {
      ...closure,
      ...parametersToArguments(parameters)
    };
    return await body.evaluate(localScope);
  };

  return {
    ...defaultValue(valueTypes.FUNCTION, asNativeString),
    asNativeString,
    asNativeBoolean,
    equals,
    asString,
    asBoolean,
    callFunction,
  };
};
