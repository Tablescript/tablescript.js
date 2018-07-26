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

import { createValue } from './default';
import { valueTypes } from './types';
import { mapFunctionParameters } from '../util/parameters';
import { replaceScope, pushStack } from '../context';

const sharedAsNativeString = type => () => `function(${type})`;
const asNativeBoolean = () => true;
const nativeEquals = () => false;

export const createNativeFunctionValue = (formalParameters, f) => {
  const asNativeString = sharedAsNativeString('native');
  const callFunction = async (context, parameters) => {
    const localContext = replaceScope(context, mapFunctionParameters(context, formalParameters, parameters));
    return f(localContext);
  };

  return createValue(
    valueTypes.FUNCTION,
    asNativeString,
    () => false,
    {},
    {
      asNativeString,
      asNativeBoolean,
      nativeEquals,
      callFunction,
    },
  );
};

export const createFunctionValue = (formalParameters, body, closure) => {
  const asNativeString = sharedAsNativeString('tablescript');
  const callFunction = async (context, parameters) => {
    const localContext = pushStack(replaceScope(context, {
      ...context.scope,
      ...closure,
      ...mapFunctionParameters(context, formalParameters, parameters),
    }));
    return body.evaluate(localContext);
  };

  return createValue(
    valueTypes.FUNCTION,
    asNativeString,
    () => false,
    {},
    {
      asNativeString,
      asNativeBoolean,
      nativeEquals,
      callFunction,
    }
  );
};
