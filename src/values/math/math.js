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

import { createNativeFunctionValue } from '../function';
import { createNumericValue } from '../numeric';

const parametersAsNativeNumbers = parameters => parameters.asArray().map(p => p.asNativeNumber());
const promisifyNumeric = n => Promise.resolve(createNumericValue(n));

const mathMax = _ => (_, scope) => promisifyNumeric(Math.max(...parametersAsNativeNumbers(scope['arguments'])));
const mathMin = _ => (_, scope) => promisifyNumeric(Math.min(...parametersAsNativeNumbers(scope['arguments'])));
const mathRound = _ => (_, scope) => promisifyNumeric(Math.round(scope['n'].asNativeNumber()));
const mathFloor = _ => (_, scope) => promisifyNumeric(Math.floor(scope['n'].asNativeNumber()));
const mathCeil = _ => (_, scope) => promisifyNumeric(Math.ceil(scope['n'].asNativeNumber()));
const mathPow = _ => (_, scope) => promisifyNumeric(Math.pow(scope['x'].asNativeNumber(), scope['y'].asNativeNumber()));

const math = {
  max: [mathMax, []],
  min: [mathMin, []],
  round: [mathRound, ['n']],
  floor: [mathFloor, ['n']],
  ceil: [mathCeil, ['n']],
  pow: [mathPow, ['x', 'y']],
};

export const initializeMath = options => Object.keys(math).reduce(
  (acc, b) => ({
    ...acc,
    [b]: createNativeFunctionValue(math[b][1], math[b][0](options))
  }),
  {},
);
