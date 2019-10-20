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
import { createNativeFunctionValue } from '../values/function';
import { requiredParameter, optionalParameterOr } from '../util/parameters';

const parametersAsNativeNumbers = context => requiredParameter(context, 'arguments').asArray().map(p => p.asNativeNumber());

const mathMax = context => context.factory.createNumericValue(Math.max(...parametersAsNativeNumbers(context)));

const mathMin = context => context.factory.createNumericValue(Math.min(...parametersAsNativeNumbers(context)));

const mathRound = context => context.factory.createNumericValue(
  Math.round(requiredParameter(context, 'n').asNativeNumber())
);

const mathFloor = context =>context.factory.createNumericValue(
  Math.floor(requiredParameter(context, 'n').asNativeNumber())
);

const mathCeil = context => context.factory.createNumericValue(
  Math.ceil(requiredParameter(context, 'n').asNativeNumber())
);

const mathPow = context => context.factory.createNumericValue(
  Math.pow(
    requiredParameter(context, 'x').asNativeNumber(),
    requiredParameter(context, 'y').asNativeNumber()
  )
);

const mathNorm = context => context.factory.createNumericValue(
  norm(
    requiredParameter(context, 'mean').asNativeNumber(),
    optionalParameterOr(context, 'stdev', context.factory.createNumericValue(1.0)).asNativeNumber(),
  )
);
const mathNormI = context => context.factory.createNumericValue(
  Math.round(
    norm(
      requiredParameter(context, 'mean').asNativeNumber(),
      optionalParameterOr(context, 'stdev', context.factory.createNumericValue(1.0)).asNativeNumber(),
    )
  )
);

export const initializeMath = () => ({
  max: createNativeFunctionValue([], mathMax),
  min: createNativeFunctionValue([], mathMin),
  round: createNativeFunctionValue(['n'], mathRound),
  floor: createNativeFunctionValue(['n'], mathFloor),
  ceil: createNativeFunctionValue(['n'], mathCeil),
  pow: createNativeFunctionValue(['x', 'y'], mathPow),
  norm: createNativeFunctionValue(['mean', 'stdev'], mathNorm),
  normI: createNativeFunctionValue(['mean', 'stdev'], mathNormI),
});
