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

import { createBooleanValue } from '../values/boolean';
import { createStringValue } from '../values/string';
import { createNumericValue } from '../values/numeric';
import { throwRuntimeError } from '../error';
import { valueTypes } from '../values/types';

export const createBinaryExpression = (context, leftExpression, operator, rightExpression) => {
  const operations = {
    'or': async (scope, leftExpression, rightExpression) => {
      const leftValue = await leftExpression.evaluate(scope);
      if (leftValue.asNativeBoolean(context)) {
        return createBooleanValue(true);
      }
      const rightValue = await rightExpression.evaluate(scope);
      return createBooleanValue(rightValue.asNativeBoolean(context));
    },
    'and': async (scope, leftExpression, rightExpression) => {
      const leftValue = await leftExpression.evaluate(scope);
      if (!leftValue.asNativeBoolean(context)) {
        return createBooleanValue(false);
      }
      const rightValue = await rightExpression.evaluate(scope);
      return createBooleanValue(rightValue.asNativeBoolean(context));
    },
    '+': async (scope, leftExpression, rightExpression) => {
      const leftValue = await leftExpression.evaluate(scope);
      const rightValue = await rightExpression.evaluate(scope);
      if (leftValue.type === valueTypes.STRING) {
        return createStringValue(leftValue.asNativeString(context) + rightValue.asNativeString(context));
      } else if (leftValue.type === valueTypes.NUMBER) {
        return createNumericValue(leftValue.asNativeNumber(context) + rightValue.asNativeNumber(context));
      }
      throwRuntimeError('Cannot add these values', context);
    },
    '-': async (scope, leftExpression, rightExpression) => {
      const leftValue = await leftExpression.evaluate(scope);
      const rightValue = await rightExpression.evaluate(scope);
      return createNumericValue(leftValue.asNativeNumber(context) - rightValue.asNativeNumber(context));
    },
    '*': async (scope, leftExpression, rightExpression) => {
      const leftValue = await leftExpression.evaluate(scope);
      const rightValue = await rightExpression.evaluate(scope);
      return createNumericValue(leftValue.asNativeNumber(context) * rightValue.asNativeNumber(context));
    },
    '/': async (scope, leftExpression, rightExpression) => {
      const leftValue = await leftExpression.evaluate(scope);
      const rightValue = await rightExpression.evaluate(scope);
      if (rightValue.asNativeNumber(context) === 0) {
        throwRuntimeError('Divide by zero', context);
      }
      return createNumericValue(leftValue.asNativeNumber(context) / rightValue.asNativeNumber(context));
    },
    '%': async (scope, leftExpression, rightExpression) => {
      const leftValue = await leftExpression.evaluate(scope);
      const rightValue = await rightExpression.evaluate(scope);
      if (rightValue.asNativeNumber(context) === 0) {
        throwRuntimeError('Divide by zero', context);
      }
      return createNumericValue(leftValue.asNativeNumber(context) % rightValue.asNativeNumber(context));
    },
    '==': async (scope, leftExpression, rightExpression) => {
      const leftValue = await leftExpression.evaluate(scope);
      const rightValue = await rightExpression.evaluate(scope);
      return createBooleanValue(leftValue.equals(context, rightValue));
    },
    '!=': async (scope, leftExpression, rightExpression) => {
      const leftValue = await leftExpression.evaluate(scope);
      const rightValue = await rightExpression.evaluate(scope);
      return createBooleanValue(!leftValue.equals(context, rightValue));
    },
    '<': async (scope, leftExpression, rightExpression) => {
      const leftValue = await leftExpression.evaluate(scope);
      const rightValue = await rightExpression.evaluate(scope);
      return createBooleanValue(leftValue.asNativeNumber(context) < rightValue.asNativeNumber(context));
    },
    '>': async (scope, leftExpression, rightExpression) => {
      const leftValue = await leftExpression.evaluate(scope);
      const rightValue = await rightExpression.evaluate(scope);
      return createBooleanValue(leftValue.asNativeNumber(context) > rightValue.asNativeNumber(context));
    },
    '<=': async (scope, leftExpression, rightExpression) => {
      const leftValue = await leftExpression.evaluate(scope);
      const rightValue = await rightExpression.evaluate(scope);
      return createBooleanValue(leftValue.asNativeNumber(context) <= rightValue.asNativeNumber(context));
    },
    '>=': async (scope, leftExpression, rightExpression) => {
      const leftValue = await leftExpression.evaluate(scope);
      const rightValue = await rightExpression.evaluate(scope);
      return createBooleanValue(leftValue.asNativeNumber(context) >= rightValue.asNativeNumber(context));
    },
  };

  return {
    evaluate: async scope => {
      if (operations[operator]) {
        return await operations[operator](scope, leftExpression, rightExpression);
      }
      throwRuntimeError(`Invalid operator ${operator}`, context);
    },
    evaluateAsLeftHandSide: async () => {
      throwRuntimeError('Cannot assign to binary expression', context);
    },
    getReferencedSymbols: () => {
      return [
        ...leftExpression.getReferencedSymbols(),
        ...rightExpression.getReferencedSymbols(),
      ];
    },
  };
};
