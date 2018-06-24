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

import { valueTypes, valueTypeName } from '../values/types';
import { throwRuntimeError } from '../error';
import { defaultExpression } from './default';
import { expressionTypes } from './types';
import { createNumericValue } from '../values/numeric';
import { createStringValue } from '../values/string';

export const createAssignmentExpression = (context, leftHandSideExpression, operator, valueExpression) => {
  const operators = {
    '=': (context, scope, leftHandSideValue, leftValue, value) => {
      leftHandSideValue.assignFrom(context, scope, value);
    },
    '+=': (context, scope, leftHandSideValue, leftValue, value) => {
      if (leftValue.type === valueTypes.STRING) {
        leftHandSideValue.assignFrom(context, scope, createStringValue(leftValue.asNativeString(context) + value.asNativeString(context)));
      } else if (leftValue.type === valueTypes.NUMBER) {
        leftHandSideValue.assignFrom(context, scope, createNumericValue(leftValue.asNativeNumber(context) + value.asNativeNumber(context)));
      } else {
        const leftValueTypeName = valueTypeName(leftValue.type);
        throwRuntimeError(`Cannot add to ${leftValueTypeName}`, context);
      }
    },
    '-=': (context, scope, leftHandSideValue, leftValue, value) => {
      if (leftValue.type === valueTypes.NUMBER) {
        leftHandSideValue.assignFrom(context, scope, createNumericValue(leftValue.asNativeNumber(context) - value.asNativeNumber(context)));
      } else {
        const leftValueTypeName = valueTypeName(leftValue.type);
        throwRuntimeError(`Cannot subtract from ${leftValueTypeName}`, context);
      }
    },
    '*=': (context, scope, leftHandSideValue, leftValue, value) => {
      if (leftValue.type === valueTypes.NUMBER) {
        leftHandSideValue.assignFrom(context, scope, createNumericValue(leftValue.asNativeNumber(context) * value.asNativeNumber(context)));
      } else {
        const leftValueTypeName = valueTypeName(leftValue.type);
        throwRuntimeError(`Cannot multiply by ${leftValueTypeName}`, context);
      }
    },
    '/=': (context, scope, leftHandSideValue, leftValue, value) => {
      if (leftValue.type === valueTypes.NUMBER) {
        if (value.asNativeNumber(context) === 0) {
          throwRuntimeError('Divide by 0', context);
        }
        leftHandSideValue.assignFrom(context, scope, createNumericValue(leftValue.asNativeNumber(context) / value.asNativeNumber(context)));
      } else {
        const leftValueTypeName = valueTypeName(leftValue.type);
        throwRuntimeError(`Cannot divide by ${leftValueTypeName}`, context);
      }
    },
    '%=': (context, scope, leftHandSideValue, leftValue, value) => {
      if (leftValue.type === valueTypes.NUMBER) {
        if (value.asNativeNumber(context) === 0) {
          throwRuntimeError('Divide by 0', context);
        }
        leftHandSideValue.assignFrom(context, scope, createNumericValue(leftValue.asNativeNumber(context) % value.asNativeNumber(context)));
      } else {
        const leftValueTypeName = valueTypeName(leftValue.type);
        throwRuntimeError(`Cannot modulo by ${leftValueTypeName}`, context);
      }
    },
  };

  const evaluate = async scope => {
    const leftHandSideValue = await leftHandSideExpression.evaluateAsLeftHandSide(context, scope);
    if (leftHandSideValue.type !== valueTypes.LEFT_HAND_SIDE) {
      throwRuntimeError('Cannot assign to a non-left-hand-side type', context);
    }
    const value = await valueExpression.evaluate(scope);
    if (operators[operator]) {
      const leftValue = (operator === '=') ? undefined : await leftHandSideExpression.evaluate(scope);
      operators[operator](context, scope, leftHandSideValue, leftValue, value);
    } else {
      throwRuntimeError(`Unknown operator ${operator}`, context);
    }
    return value;
  };

  return {
    ...defaultExpression(expressionTypes.ASSIGNMENT, evaluate),
  };
};
