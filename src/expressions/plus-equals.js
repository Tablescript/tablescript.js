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

import { valueTypes } from '../values/types';
import { throwRuntimeError } from '../error';
import { createStringValue } from '../values/string';
import { createNumericValue } from '../values/numeric';

export const createPlusEqualsExpression = (context, leftHandSideExpression, valueExpression) => {
  const evaluate = async scope => {
    const leftHandSideValue = await leftHandSideExpression.evaluateAsLeftHandSide(context, scope);
    if (leftHandSideValue.type !== valueTypes.LEFT_HAND_SIDE) {
      throwRuntimeError('Cannot assign to a non-left-hand-side type', context);
    }
    const leftValue = await leftHandSideExpression.evaluate(scope);
    const rightValue = await valueExpression.evaluate(scope);
    if (leftValue.type === valueTypes.STRING) {
      leftHandSideValue.assignFrom(context, scope, createStringValue(leftValue.asNativeString(context) + rightValue.asNativeString(context)));
      return rightValue;
    } else if (leftValue.type === valueTypes.NUMBER) {
      leftHandSideValue.assignFrom(context, scope, createNumericValue(leftValue.asNativeNumber(context) + rightValue.asNativeNumber(context)));
      return rightValue;
    }
    throwRuntimeError('Cannot add these values', context);
  };

  const getReferencedSymbols = () => {
    return [
      ...leftHandSideExpression.getReferencedSymbols(),
      ...valueExpression.getReferencedSymbols(),
    ];
  };

  return {
    evaluate,
    evaluateAsLeftHandSide: () => {
      throwRuntimeError('Cannot assign to assignment expression', context);
    },
    getReferencedSymbols,
  };
};
