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

import { assertBuiltIn } from './assert';
import { chooseBuiltIn } from './choose';
import { keysBuiltIn } from './keys';
import { printBuiltIn } from './print';
import { rangeBuiltIn } from './range';
import { requireBuiltIn } from './require';
import { valueTypes } from '../values/types';
import { createValue } from '../values/default';

const createBuiltInFunctionValue = (name, callFunction) => {
  const asNativeString = () => `builtin function(${name})`;
  return createValue(
    valueTypes.FUNCTION,
    asNativeString,
    [],
    {
      asNativeString,
      asNativeBoolean: () => true,
      asString: () => createStringValue(asNativeString()),
      asBoolean: () => createBooleanValue(asNativeBoolean()),
      callFunction,
    }
  );
};

const builtIns = {
  'assert': assertBuiltIn,
  choose: chooseBuiltIn,
  keys: keysBuiltIn,
  print: printBuiltIn,
  range: rangeBuiltIn,
  'require': requireBuiltIn,
};

export const initializeBuiltins = options => Object.keys(builtIns).reduce(
  (acc, b) => ({
    ...acc,
    [b]: createBuiltInFunctionValue(b, builtIns[b](options))
  }),
  {},
);
