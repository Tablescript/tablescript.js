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

import R from 'ramda';
import { createValue } from './default';
import { valueTypes } from './types';
import { createStringValue } from './string';
import { createBooleanValue } from './boolean';
import { mapFunctionParameters } from '../util/parameters';

const sharedAsNativeString = type => () => `function(${type})`;
const asNativeBoolean = () => true;
const nativeEquals = () => false;
const equals = () => createBooleanValue(false);
const sharedAsString = type => R.pipe(sharedAsNativeString(type), createStringValue);
const asBoolean = R.pipe(asNativeBoolean, createBooleanValue);

export const createNativeFunctionValue = (formalParameters, f) => {
  const asNativeString = sharedAsNativeString('native');
  const asString = sharedAsString('native');
  const callFunction = async (context, parameters) => await f(context, mapFunctionParameters(formalParameters, parameters));

  return createValue(
    valueTypes.FUNCTION,
    asNativeString,
    [],
    {
      asNativeString,
      asNativeBoolean,
      nativeEquals,
      asString,
      asBoolean,
      callFunction,
      equals,
    },
  );
};

export const createFunctionValue = (formalParameters, body, closure) => {
  const asNativeString = sharedAsNativeString('tablescript');
  const asString = sharedAsString('tablescript');
  const callFunction = async (context, parameters) => {
    const localScope = {
      ...closure,
      ...mapFunctionParameters(formalParameters, parameters)
    };
    return await body.evaluate(localScope);
  };

  return createValue(
    valueTypes.FUNCTION,
    asNativeString,
    [],
    {
      asNativeString,
      asNativeBoolean,
      nativeEquals,
      asString,
      asBoolean,
      callFunction,
      equals,
    }
  );
};
