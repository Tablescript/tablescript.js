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

import * as R from 'ramda';
import { createValue } from './default';
import { valueTypes, isNumber, isString, isArray, isObject, isUndefined } from './types';
import { bindFunctionParameters } from './util/parameters';
import { throwRuntimeError } from '../error';

export const nativeFunctionParameter = (name, extractor) => ({ name, extractor });

export const requiredParameterF = (transformer = R.identity) => (context, signature, parameterName) => {
  const value = context.getLocalVariable(parameterName);
  if (isUndefined(value)) {
    throwRuntimeError(`${signature} missing required parameter "${parameterName}"`, context);
  }
  return transformer(value);
};

const requiredTypedParameterF = (validator, typeName) => (transformer = R.identity) => (context, signature, parameterName) => {
  const value = context.getLocalVariable(parameterName);
  if (isUndefined(value)) {
    throwRuntimeError(`${signature} missing required parameter "${parameterName}"`, context);
  }
  if (!validator(value)) {
    throwRuntimeError(`${signature} ${parameterName} must be ${typeName}`, context);
  }
  return transformer(value);
};

export const requiredNumericParameterF = requiredTypedParameterF(isNumber, 'a number');
export const requiredStringParameterF = requiredTypedParameterF(isString, 'a string');
export const requiredArrayParameterF = requiredTypedParameterF(isArray, 'an array');
export const requiredObjectParameterF = requiredTypedParameterF(isObject, 'an object');

export const optionalParameterF = (transformer = R.identity) => (context, signature, parameterName) => {
  const value = context.getLocalVariable(parameterName);
  if (!isUndefined(value)) {
    return transformer(value);
  }
  return context.factory.createUndefined();
};

const optionalTypedParameterF = (validator, factoryProp, typeName) =>
  (transformer = R.identity, defaultValue) =>
  (context, signature, parameterName) => {
  const value = context.getLocalVariable(parameterName);
  if (!isUndefined(value)) {
    if (!validator(value)) {
      throwRuntimeError(`${signature} ${parameterName} must be ${typeName}`, context);
    }
    return transformer(value);
  }
  if (defaultValue) {
    return transformer(factoryProp(context.factory)(defaultValue));
  }
  return context.factory.createUndefined();
};

export const optionalNumericParameterF = optionalTypedParameterF(isNumber, R.prop('createNumericValue'), 'a number');
export const optionalStringParameterF = optionalTypedParameterF(isString, R.prop('createStringValue'), 'a string');

export const toNativeNumber = value => value.asNativeNumber();
export const toNativeString = value => value.asNativeString();
export const toNativeBoolean = value => value.asNativeBoolean();
export const toArray = value => value.asArray();
export const toObject = value => value.asObject();

export const toNumericResult = (context, value) => context.factory.createNumericValue(value);
export const toStringResult = (context, value) => context.factory.createStringValue(value);
export const toBooleanResult = (context, value) => context.factory.createBooleanValue(value);
export const toArrayResult = (context, value) => context.factory.createArrayValue(value);
export const toUndefinedResult = context => context.factory.createUndefined();

const extractParameter = (context, signature) => parameter => parameter.extractor(context, signature, parameter.name);

const nopFilter = (_, value) => value;

export const createNativeFunctionValue = (name, formalParameters, f, filter = nopFilter) => {
  const formalParameterNames = R.map(R.prop('name'), formalParameters);
  const signature = `${name}(${formalParameterNames.join(',')})`;

  const asNativeString = R.always('function(native)');

  return createValue(
    valueTypes.FUNCTION,
    asNativeString,
    R.F,
    R.F,
    {},
    {
      asNativeString,
      asNativeBoolean: R.T,
      callFunction: (context, parameters) => {
        const oldScopes = context.swapScopes([
          bindFunctionParameters(context, formalParameterNames, parameters),
        ]);
        const parameterValues = R.map(extractParameter(context, signature), formalParameters);
        const result = filter(context, f(context, parameters, ...parameterValues));
        context.swapScopes(oldScopes);
        return result;
      },
    },
  );
};
