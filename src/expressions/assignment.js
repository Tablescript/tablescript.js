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

import { isLeftHandSide } from '../values/types';
import { throwRuntimeError } from '../error';
import { createExpression } from './default';
import { expressionTypes } from './types';
import { updateStack } from '../context';

const operators = {
  '=': (context, leftHandSideValue, leftValue, value) => {
    leftHandSideValue.assignFrom(context, value);
  },
  '+=': (context, leftHandSideValue, leftValue, value) => {
    leftHandSideValue.assignFrom(context, leftValue.add(context, value));
  },
  '-=': (context, leftHandSideValue, leftValue, value) => {
    leftHandSideValue.assignFrom(context, leftValue.subtract(context, value));
  },
  '*=': (context, leftHandSideValue, leftValue, value) => {
    leftHandSideValue.assignFrom(context, leftValue.multiplyBy(context, value));
  },
  '/=': (context, leftHandSideValue, leftValue, value) => {
    leftHandSideValue.assignFrom(context, leftValue.divideBy(context, value));
  },
  '%=': (context, leftHandSideValue, leftValue, value) => {
    leftHandSideValue.assignFrom(context, leftValue.modulo(context, value));
  },
};

const evaluate = (location, leftHandSideExpression, operator, valueExpression) => async context => {
  const localContext = updateStack(context, location);
  const leftHandSideValue = await leftHandSideExpression.evaluateAsLeftHandSide(localContext);
  if (!isLeftHandSide(leftHandSideValue)) {
    throwRuntimeError('Cannot assign to a non-left-hand-side type', localContext);
  }
  const value = await valueExpression.evaluate(localContext);
  if (operators[operator]) {
    const leftValue = (operator === '=') ? undefined : await leftHandSideExpression.evaluate(localContext);
    operators[operator](localContext, leftHandSideValue, leftValue, value);
  } else {
    throwRuntimeError(`Unknown operator ${operator}`, location);
  }
  return value;
};

export const createAssignmentExpression = (location, leftHandSideExpression, operator, valueExpression) => {
  return createExpression(expressionTypes.ASSIGNMENT, evaluate(location, leftHandSideExpression, operator, valueExpression));
};
