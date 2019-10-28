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
import { randomNumber } from '../util/random';
import {
  createNativeFunctionValue,
  toArrayResult,
} from '../values';
import { throwRuntimeError } from '../error';

const randomEntry = items => items[randomNumber(items.length) - 1];

const nUniqueRolls = (n, max) => {
  let rolls = [];
  while (rolls.length < n) {
    rolls = R.uniq(R.append(randomNumber(max) - 1, rolls));
  }
  return rolls;
};

export const chooseBuiltIn = createNativeFunctionValue(
  'choose',
  ['items'],
  (context, args, items) => randomEntry(items.asArray()),
);

export const chooseNBuiltIn = createNativeFunctionValue(
  'chooseN',
  ['items', 'n'],
  (context, args, items, n) => {
    if (n.asNativeNumber() <= 0) {
      throwRuntimeError(`Cannot choose ${n.asNativeNumber()} items`, context);
    }
    return R.map(
      () => randomEntry(items.asArray()),
      R.range(0, n.asNativeNumber()),
    );
  },
  toArrayResult,
);

export const chooseUniqueNBuiltIn = createNativeFunctionValue(
  'chooseNUnique',
  ['items', 'n'],
  (context, args, items, n) => {
    if (n.asNativeNumber() <= 0) {
      throwRuntimeError(`Cannot choose ${n.asNativeNumber()} items`, context);
    }
    if (n.asNativeNumber() > items.asArray().length) {
      throwRuntimeError(`Cannot choose unique ${n.asNativeNumber()} of ${items.asArray().length}`);
    }
    if (n.asNativeNumber() === items.asArray().length) {
      return items.asArray();
    }
    return R.map(
      n => items.asArray()[n],
      nUniqueRolls(n.asNativeNumber(), items.asArray().length),
    );
  },
  toArrayResult,
);
