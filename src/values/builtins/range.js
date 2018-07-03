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

import { createBuiltInFunctionValue } from '../default';
import { throwRuntimeError } from '../../error';
import { createNumericValue } from '../numeric';
import { createArrayValue } from '../array';

export const rangeBuiltIn = _ => (context, _, parameters) => {
  let startValue = 0;
  let endValue;
  let stepValue = 1;
  if (parameters.length === 1) {
    endValue = parameters[0].asNativeNumber(context);
  } else if (parameters.length === 2) {
    startValue = parameters[0].asNativeNumber(context);
    endValue = parameters[1].asNativeNumber(context);
    if (endValue < startValue) {
      stepValue = -1;
    }
  } else if (parameters.length === 3) {
    startValue = parameters[0].asNativeNumber(context);
    endValue = parameters[1].asNativeNumber(context);
    stepValue = parameters[2].asNativeNumber(context);
    if (endValue < startValue && stepValue >= 0) {
      throwRuntimeError('range(end|[start, end]|[start, end, step]) step must be negative if end is less than start', context);
    }
    if (endValue > startValue && stepValue <= 0) {
      throwRuntimeError('range(end|[start, end]|[start, end, step]) step must be positive if start is less than end', context);
    }
  } else {
    throwRuntimeError('range(end|[start, end]|[start, end, step]) takes 1, 2, or 3 numeric parameters', context);
  }
  const result = [];
  for (let i = startValue; i < endValue; i += stepValue) {
    result.push(createNumericValue(i));
  }
  return createArrayValue(result);
};
