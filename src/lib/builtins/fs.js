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
import {
  createNativeFunctionValue,
  toArrayResult,
  toObjectResult,
  toBooleanResult
} from '../values';

export const loadJsonBuiltIn = createNativeFunctionValue(
  'loadJson',
  ['filename'],
  (context, args, filename) => {
    const contents = context.options.io.fs.readFileSync(filename, 'utf-8');
    const o = JSON.parse(contents);
    if (R.isNil(o)) {
      ...
    }
    
    R.map(context.factory.createStringValue),
    R.keys,
  )(o.asObject(context)),
  toObjectResult,
);

export const valuesBuiltIn = createNativeFunctionValue(
  'values',
  ['o'],
  (context, args, o) => R.values(o.asObject(context)),
  toArrayResult,
);

export const toPairsBuiltIn = createNativeFunctionValue(
  'toPairs',
  ['o'],
  (context, args, o) => R.compose(
    R.map(context.factory.createArrayValue),
    R.map(([key, value]) => ([context.factory.createStringValue(key), value])),
    R.toPairs,
  )(o.asObject(context)),
  toArrayResult,
);

export const fromPairsBuiltIn = createNativeFunctionValue(
  'fromPairs',
  ['a'],
  (context, args, a) => R.compose(
    R.fromPairs,
    R.map(([keyValue, value]) => ([keyValue.asNativeString(), value])),
    R.map(e => e.asArray(context)),
  )(a.asArray(context)),
  toObjectResult,
);

export const hasKeyBuiltIn = createNativeFunctionValue(
  'hasKey',
  ['o', 's'],
  (context, args, o, s) => R.has(s.asNativeString(), o.asObject(context)),
  toBooleanResult,
);
