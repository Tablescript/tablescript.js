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

import { assertBuiltIn } from './assert';
import { chooseBuiltIn } from './choose';
import { keysBuiltIn } from './keys';
import { printBuiltIn } from './print';
import { rangeBuiltIn } from './range';
import { requireBuiltIn } from './require';
import { createNativeFunctionValue } from '../values/function';
import { createObjectValue } from '../values/object';
import { strBuiltIn, intBuiltIn } from './convert';
import { initializeMath } from './math';

export const initializeBuiltins = () => ({
  assert: createNativeFunctionValue(['condition', 'message'], assertBuiltIn),
  choose: chooseBuiltIn,
  keys: createNativeFunctionValue(['o'], keysBuiltIn),
  print: createNativeFunctionValue([], printBuiltIn),
  range: createNativeFunctionValue(['start', 'end', 'step'], rangeBuiltIn),
  require: createNativeFunctionValue(['filename'], requireBuiltIn),
  str: createNativeFunctionValue(['s'], strBuiltIn),
  int: createNativeFunctionValue(['i'], intBuiltIn),
  math: createObjectValue({
    ...initializeMath(),
  }),
});
