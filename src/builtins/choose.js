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

import { valueTypes } from '../values/types';
import { defaultValue } from '../values/default';
import { throwRuntimeError } from '../error';
import { createStringValue } from '../values/string';
import { createBooleanValue } from '../values/boolean';

export const createChooseBuiltin = () => {
  const asNativeString = () => 'builtin function(choose)';
  const asNativeBoolean = () => true;

  const asString = () => createStringValue(asNativeString());
  const asBoolean = () => createBooleanValue(asNativeBoolean());

  const callFunction = (context, scope, parameters) => {
    if (parameters.length !== 1) {
      throwRuntimeError('choose(items) takes a single array parameter', context);
    }
    const items = parameters[0].asArray();
    const roll = randomNumber(items.length) - 1;
    return items[roll];
  };

  return {
    ...defaultValue(valueTypes.FUNCTION, asNativeString),
    asNativeString,
    asNativeBoolean,
    asString,
    asBoolean,
    callFunction,
  };
};
