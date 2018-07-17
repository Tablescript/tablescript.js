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
import { createExpression } from './default';
import { expressionTypes } from './types';

const operators = {
  '=': (context, scope, leftHandSideValue, leftValue, value) => {
    leftHandSideValue.assignFrom(context, scope, value);
  },
  '+=': (context, scope, leftHandSideValue, leftValue, value) => {
    leftHandSideValue.assignFrom(context, scope, leftValue.add(context, value));
  },
  '-=': (context, scope, leftHandSideValue, leftValue, value) => {
    leftHandSideValue.assignFrom(context, scope, leftValue.subtract(context, value));
  },
  '*=': (context, scope, leftHandSideValue, leftValue, value) => {
    leftHandSideValue.assignFrom(context, scope, leftValue.multiplyBy(context, value));
  },
  '/=': (context, scope, leftHandSideValue, leftValue, value) => {
    leftHandSideValue.assignFrom(context, scope, leftValue.divideBy(context, value));
  },
  '%=': (context, scope, leftHandSideValue, leftValue, value) => {
    leftHandSideValue.assignFrom(context, scope, leftValue.modulo(context, value));
  },
};

const evaluate = (context, leftHandSideExpression, operator, valueExpression) => async (scope, options) => {
  const leftHandSideValue = await leftHandSideExpression.evaluateAsLeftHandSide(context, scope, options);
  if (leftHandSideValue.type !== valueTypes.LEFT_HAND_SIDE) {
    throwRuntimeError('Cannot assign to a non-left-hand-side type', context);
  }
  const value = await valueExpression.evaluate(scope, options);
  if (operators[operator]) {
    const leftValue = (operator === '=') ? undefined : await leftHandSideExpression.evaluate(scope, options);
    operators[operator](context, scope, leftHandSideValue, leftValue, value);
  } else {
    throwRuntimeError(`Unknown operator ${operator}`, context);
  }
  return value;
};

export const createAssignmentExpression = (context, leftHandSideExpression, operator, valueExpression) => {
  return createExpression(expressionTypes.ASSIGNMENT, evaluate(context, leftHandSideExpression, operator, valueExpression));
};
