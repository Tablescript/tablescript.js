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

import { createObjectValue } from '../values';
import { assertBuiltIn } from './assert';
import {
  chooseBuiltIn,
  chooseNBuiltIn,
} from './choose';
import {
  keysBuiltIn,
  valuesBuiltIn,
  toPairsBuiltIn,
  fromPairsBuiltIn,
} from './objects';
import { printBuiltIn } from './print';
import { rangeBuiltIn } from './range';
import { importBuiltIn } from './import';
import { strBuiltIn, intBuiltIn, boolBuiltIn } from './convert';
import { initializeMath } from './math';
import { typeOfBuiltIn } from './typeof';

export const initializeBuiltins = () => ({
  assert: assertBuiltIn,
  choose: chooseBuiltIn,
  chooseN: chooseNBuiltIn,
  keys: keysBuiltIn,
  values: valuesBuiltIn,
  toPairs: toPairsBuiltIn,
  fromPairs: fromPairsBuiltIn,
  print: printBuiltIn,
  range: rangeBuiltIn,
  import: importBuiltIn,
  typeOf: typeOfBuiltIn,
  str: strBuiltIn,
  int: intBuiltIn,
  bool: boolBuiltIn,
  math: createObjectValue({
    ...initializeMath(),
  }),
});
