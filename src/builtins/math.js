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
import { createNativeFunctionValue } from '../values/function';
import { requiredParameter, optionalParameterOr } from '../util/parameters';
import { isString, isNumber, isBoolean } from '../values/types';
import { throwRuntimeError } from '../error';

const parametersAsNativeNumbers = context => requiredParameter(context, 'arguments').asArray().map(p => p.asNativeNumber(context));

const mathMax = createNativeFunctionValue([], async context => context.factory.createNumericValue(Math.max(...parametersAsNativeNumbers(context))));
const mathMin = createNativeFunctionValue([], async context => context.factory.createNumericValue(Math.min(...parametersAsNativeNumbers(context))));
const mathRound = createNativeFunctionValue(['n'], async context => context.factory.createNumericValue(Math.round(requiredParameter(context, 'n').asNativeNumber(context))));
const mathFloor = createNativeFunctionValue(['n'], async context =>context.factory.createNumericValue(Math.floor(requiredParameter(context, 'n').asNativeNumber(context))));
const mathCeil = createNativeFunctionValue(['n'], async context => context.factory.createNumericValue(Math.ceil(requiredParameter(context, 'n').asNativeNumber(context))));
const mathPow = createNativeFunctionValue(['x', 'y'], async context => context.factory.createNumericValue(Math.pow(requiredParameter(context, 'x').asNativeNumber(context), requiredParameter(context, 'y').asNativeNumber(context))));
const mathNorm = createNativeFunctionValue(['mean', 'stdev'], async context => 
  context.factory.createNumericValue(
    norm(
      requiredParameter(context, 'mean').asNativeNumber(context),
      optionalParameterOr(context, 'stdev', context.factory.createNumericValue(1.0)).asNativeNumber(context),
    )
  )
);
const mathNormI = createNativeFunctionValue(['mean', 'stdev'], async context => 
  context.factory.createNumericValue(
    Math.round(
      norm(
        requiredParameter(context, 'mean').asNativeNumber(context),
        optionalParameterOr(context, 'stdev', context.factory.createNumericValue(1.0)).asNativeNumber(context),
      )
    )
  )
);

const mathInt = createNativeFunctionValue(['i'], async context => {
  const i = requiredParameter(context, 'i');
  if (isNumber(i)) {
    return context.factory.createNumericValue(Math.round(i.asNativeValue(context)));
  }
  if (isString(i)) {
    return context.factory.createNumericValue(parseInt(i.asNativeString(context)));
  }
  if (isBoolean(i)) {
    return context.factory.createNumericValue(i.asNativeBoolean(context) ? 1 : 0);
  }
  throwRuntimeError(`Cannot convert #{i.type} to NUMBER`);
});

const builtInStr = createNativeFunctionValue(['s'], async context => {
  const s = requiredParameter(context, 's');
  if (isString(s)) {
    return s;
  }
  return context.factory.createStringValue(s.asNativeString(context));
});

export const initializeMath = () => ({
  max: mathMax,
  min: mathMin,
  round: mathRound,
  floor: mathFloor,
  ceil: mathCeil,
  pow: mathPow,
  norm: mathNorm,
  normI: mathNormI,
  int: mathInt,
  str: builtInStr,
});
