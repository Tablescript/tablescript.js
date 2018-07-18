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

const or = async (location, leftValue, rightExpression, context) => {
  if (leftValue.asNativeBoolean(location)) {
    return createBooleanValue(true);
  }
  const rightValue = await rightExpression.evaluate(context);
  return createBooleanValue(rightValue.asNativeBoolean(location));
};

const and = async (location, leftValue, rightExpression, context) => {
  if (!leftValue.asNativeBoolean(location)) {
    return createBooleanValue(false);
  }
  const rightValue = await rightExpression.evaluate(context);
  return createBooleanValue(rightValue.asNativeBoolean(location));
};

const plus = (location, leftValue, rightValue) => leftValue.add(location, rightValue);
const minus = (location, leftValue, rightValue) => leftValue.subtract(location, rightValue);
const multiply = (location, leftValue, rightValue) => leftValue.multiplyBy(location, rightValue);
const divide = (location, leftValue, rightValue) => leftValue.divideBy(location, rightValue);
const modulo = (location, leftValue, rightValue) => leftValue.modulo(location, rightValue);
const equals = (location, leftValue, rightValue) => leftValue.equals(location, rightValue);
const notEquals = (location, leftValue, rightValue) => leftValue.notEquals(location, rightValue);
const lessThan = (location, leftValue, rightValue) => leftValue.lessThan(location, rightValue);
const greaterThan = (location, leftValue, rightValue) => leftValue.greaterThan(location, rightValue);
const lessThanOrEquals = (location, leftValue, rightValue) => leftValue.lessThanOrEquals(location, rightValue);
const greaterThanOrEquals = (location, leftValue, rightValue) => leftValue.lessThan(location, rightValue);

const evaluateLeft = f => async (location, leftExpression, rightExpression, context) => {
  const leftValue = await leftExpression.evaluate(context);
  return f(location, leftValue, rightExpression, context);
};

const evaluateBoth = f => async (location, leftExpression, rightExpression, context) => {
  const leftValue = await leftExpression.evaluate(context);
  const rightValue = await rightExpression.evaluate(context);
  return f(location, leftValue, rightValue);
};

export const allOperators = {
  'or': evaluateLeft(or),
  'and': evaluateLeft(and),
  '+': evaluateBoth(plus),
  '-': evaluateBoth(minus),
  '*': evaluateBoth(multiply),
  '/': evaluateBoth(divide),
  '%': evaluateBoth(modulo),
  '==': evaluateBoth(equals),
  '!=': evaluateBoth(notEquals),
  '<': evaluateBoth(lessThan),
  '>': evaluateBoth(greaterThan),
  '<=': evaluateBoth(lessThanOrEquals),
  '>=': evaluateBoth(greaterThanOrEquals),
};
