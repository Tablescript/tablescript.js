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

import { norm } from './norm';
import { createNativeFunctionValue, requiredParameter, optionalParameterOr } from '../values/function';
import { createNumericValue } from '../values/numeric';

const parametersAsNativeNumbers = context => requiredParameter(context, 'arguments').asArray().map(p => p.asNativeNumber(context));

const promisifyNumeric = n => Promise.resolve(createNumericValue(n));

const mathMax = createNativeFunctionValue([], context => promisifyNumeric(Math.max(...parametersAsNativeNumbers(context))));
const mathMin = createNativeFunctionValue([], context => promisifyNumeric(Math.min(...parametersAsNativeNumbers(context))));
const mathRound = createNativeFunctionValue(['n'], context => promisifyNumeric(Math.round(requiredParameter(context, 'n').asNativeNumber(context))));
const mathFloor = createNativeFunctionValue(['n'], context =>promisifyNumeric(Math.floor(requiredParameter(context, 'n').asNativeNumber(context))));
const mathCeil = createNativeFunctionValue(['n'], context => promisifyNumeric(Math.ceil(requiredParameter(context, 'n').asNativeNumber(context))));
const mathPow = createNativeFunctionValue(['x', 'y'], context => promisifyNumeric(Math.pow(requiredParameter(context, 'x').asNativeNumber(context), requiredParameter(context, 'y').asNativeNumber(context))));
const mathNorm = createNativeFunctionValue(['mean', 'stdev'], context => 
  promisifyNumeric(
    norm(
      requiredParameter(context, 'mean').asNativeNumber(context),
      optionalParameterOr(context, 'stdev', createNumericValue(1.0)).asNativeNumber(context),
    )
  )
);
const mathNormI = createNativeFunctionValue(['mean', 'stdev'], context => 
  promisifyNumeric(
    Math.round(
      norm(
        requiredParameter(context, 'mean').asNativeNumber(context),
        optionalParameterOr(context, 'stdev', createNumericValue(1.0)).asNativeNumber(context),
      )
    )
  )
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
