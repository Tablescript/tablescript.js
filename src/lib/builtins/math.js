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

import { norm } from './norm';
import {
  createNativeFunctionValue,
  nativeFunctionParameter,
  requiredNumericParameter,
  optionalNumericParameter,
  toNativeNumber,
  toNumericResult
} from '../values';

const parametersAsNativeNumbers = args => args.map(p => p.asNativeNumber());

const mathMax = createNativeFunctionValue(
  'max',
  [],
  (context, args) => Math.max(...parametersAsNativeNumbers(args)),
  toNumericResult,
);

const mathMin = createNativeFunctionValue(
  'min',
  [],
  (context, args) => Math.min(...parametersAsNativeNumbers(args)),
  toNumericResult,
);

const mathRound = createNativeFunctionValue(
  'round',
  ['n'],
  (_, args, n) => Math.round(n.asNativeNumber()),
  toNumericResult,
);

const mathFloor = createNativeFunctionValue(
  'floor',
  ['n'],
  (_, args, n) => Math.floor(n.asNativeNumber()),
  toNumericResult,
);

const mathCeil = createNativeFunctionValue(
  'ceil',
  ['n'],
  (_, args, n) => Math.ceil(n.asNativeNumber()),
  toNumericResult,
);

const mathPow = createNativeFunctionValue(
  'pow',
  ['x', 'y'],
  (_, args, x, y) => Math.pow(x.asNativeNumber(), y.asNativeNumber()),
  toNumericResult,
);

const mathNorm = createNativeFunctionValue(
  'norm',
  ['mean', 'stdev'],
  (_, args, mean, stdev) => {
    const resolvedStdev = isUndefined(stdev) ? 1.0 : stdev.asNativeNumber();
    return norm(mean.asNativeNumber(), resolvedStdev);
  },
  toNumericResult,
);

const mathNormI = createNativeFunctionValue(
  'normI',
  ['mean', 'stdev'],  
  (_, args, mean, stdev) => {
    const resolvedStdev = isUndefined(stdev) ? 1.0 : stdev.asNativeNumber();
    return Math.round(norm(mean.asNativeNumber(), resolvedStdev));
  },
  toNumericResult,
);

export const initializeMath = () => ({
  max: mathMax,
  min: mathMin,
  round: mathRound,
  floor: mathFloor,
  ceil: mathCeil,
  pow: mathPow,
  norm: mathNorm,
  normI: mathNormI,
});
