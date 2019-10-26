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

import { isLeftHandSide } from '../values';
import { throwRuntimeError } from '../error';
import { createExpression } from './default';
import { expressionTypes } from './types';
import { withSetLocation } from './util/context';

const operators = {
  '=': (context, leftHandSideValue, leftValue, value) => {
    leftHandSideValue.assignFrom(context, value);
    return value;
  },
  '+=': (context, leftHandSideValue, leftValue, value) => {
    const result = leftValue.add(context, value);
    leftHandSideValue.assignFrom(context, result);
    return result;
  },
  '-=': (context, leftHandSideValue, leftValue, value) => {
    const result = leftValue.subtract(context, value);
    leftHandSideValue.assignFrom(context, result);
    return result;
  },
  '*=': (context, leftHandSideValue, leftValue, value) => {
    const result = leftValue.multiplyBy(context, value);
    leftHandSideValue.assignFrom(context, result);
    return result;
  },
  '/=': (context, leftHandSideValue, leftValue, value) => {
    const result = leftValue.divideBy(context, value);
    leftHandSideValue.assignFrom(context, result);
    return result;
  },
  '%=': (context, leftHandSideValue, leftValue, value) => {
    const result = leftValue.modulo(context, value);
    leftHandSideValue.assignFrom(context, result);
    return result;
  },
};

const evaluate = (leftHandSideExpression, operator, valueExpression) => context => {
  const leftHandSideValue = leftHandSideExpression.evaluateAsLeftHandSide(context);
  if (!isLeftHandSide(leftHandSideValue)) {
    throwRuntimeError('Cannot assign to a non-left-hand-side type', context);
  }
  const value = valueExpression.evaluate(context);
  if (operators[operator]) {
    const leftValue = (operator === '=') ? undefined : leftHandSideExpression.evaluate(context);
    return operators[operator](context, leftHandSideValue, leftValue, value);
  }
  throwRuntimeError(`Unknown operator "${operator}"`, context);
};

export const createAssignmentExpression = (
  location,
  leftHandSideExpression,
  operator,
  valueExpression
) => createExpression(
  expressionTypes.ASSIGNMENT,
  withSetLocation(location, evaluate(leftHandSideExpression, operator, valueExpression)),
);
