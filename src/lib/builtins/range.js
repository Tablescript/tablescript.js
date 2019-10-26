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

import { throwRuntimeError } from '../error';
import {
  createNativeFunctionValue,
  nativeFunctionParameter,
  requiredNumericParameterF,
  optionalNumericParameterF,
  toNativeNumber,
  toArrayResult
} from '../values';

const createRangeArray = (context, start, end, step) => {
  const result = [];
  if (step > 0) {
    for (let i = start; i < end; i += step) {
      result.push(context.factory.createNumericValue(i));
    }
  } else {
    for (let i = start; i > end; i += step) {
      result.push(context.factory.createNumericValue(i));
    }
  }

  return result;
};

export const rangeBuiltIn = createNativeFunctionValue(
  'range',
  [
    nativeFunctionParameter('start', requiredNumericParameterF(toNativeNumber)),
    nativeFunctionParameter('end', optionalNumericParameterF(toNativeNumber)),
    nativeFunctionParameter('step', optionalNumericParameterF(toNativeNumber)),
  ],
  (context, args, startValue, endValue, stepValue) => {
    if (args.length === 1) {
      return createRangeArray(context, 0, startValue, startValue > 0 ? 1 : -1);
    }
    if (args.length === 2) {
      return createRangeArray(context, startValue, endValue, startValue <= endValue ? 1 : -1);
    }
    if (endValue < startValue && stepValue >= 0) {
      throwRuntimeError('range(end|[start, end]|[start, end, step]) step must be negative if end is less than start', context);
    }
    if (endValue > startValue && stepValue <= 0) {
      throwRuntimeError('range(end|[start, end]|[start, end, step]) step must be positive if start is less than end', context);
    }
    return createRangeArray(context, startValue, endValue, stepValue);
  },
  toArrayResult,
);
