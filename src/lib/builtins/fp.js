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
import { throwRuntimeError } from '../error';
import {
  createNativeFunctionValue,
} from '../values';

export const pipeBuiltIn = createNativeFunctionValue(
  'pipe',
  [],
  (context, outerArgs) => {
    if (outerArgs.length < 1) {
      throwRuntimeError(`pipe(f, ...) requires at least one parameter`, context);
    }
    return createNativeFunctionValue(
      'piped',
      [],
      (context, innerArgs) => R.reduce(
        (result, f) => f.callFunction(context, [result]),
        outerArgs[0].callFunction(context, innerArgs),
        outerArgs.slice(1),
      ),
    );
  },
);

export const composeBuiltIn = createNativeFunctionValue(
  'compose',
  [],
  (context, outerArgs) => {
    if (outerArgs.length < 1) {
      throwRuntimeError(`compose(f, ...) requires at least one parameter`, context);
    }
    return createNativeFunctionValue(
      'composed',
      [],
      (context, innerArgs) => R.reduce(
        (result, f) => f.callFunction(context, [result]),
        R.reverse(outerArgs)[0].callFunction(context, innerArgs),
        R.reverse(outerArgs).slice(1),
      ),
    );
  },
);
