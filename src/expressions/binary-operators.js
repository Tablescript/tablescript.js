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

export const or = async (context, leftValue, rightExpression, scope) => {
  if (leftValue.asNativeBoolean(context)) {
    return createBooleanValue(true);
  }
  const rightValue = await rightExpression.evaluate(scope);
  return createBooleanValue(rightValue.asNativeBoolean(context));
};

export const and = async (context, leftValue, rightExpression, scope) => {
  if (!leftValue.asNativeBoolean(context)) {
    return createBooleanValue(false);
  }
  const rightValue = await rightExpression.evaluate(scope);
  return createBooleanValue(rightValue.asNativeBoolean(context));
};

const plus = (context, leftValue, rightValue) => leftValue.add(context, rightValue);
const minus = (context, leftValue, rightValue) => leftValue.subtract(context, rightValue);
const multiply = (context, leftValue, rightValue) => leftValue.multiplyBy(context, rightValue);
const divide = (context, leftValue, rightValue) => leftValue.divideBy(context, rightValue);
const modulo = (context, leftValue, rightValue) => leftValue.modulo(context, rightValue);
const equals = (context, leftValue, rightValue) => leftValue.equals(context, rightValue);
const notEquals = (context, leftValue, rightValue) => leftValue.notEquals(context, rightValue);
const lessThan = (context, leftValue, rightValue) => leftValue.lessThan(context, rightValue);
const greaterThan = (context, leftValue, rightValue) => leftValue.greaterThan(context, rightValue);
const lessThanOrEquals = (context, leftValue, rightValue) => leftValue.lessThanOrEquals(context, rightValue);
const greaterThanOrEquals = (context, leftValue, rightValue) => leftValue.lessThan(context, rightValue);

const evaluateLeft = f => (context, leftExpression, rightExpression) => async scope => {
  const leftValue = await leftExpression.evaluate(scope);
  return f(context, leftValue, rightExpression, scope);
};

const evaluateBoth = f => (context, leftExpression, rightExpression) => async scope => {
  const leftValue = await leftExpression.evaluate(scope);
  const rightValue = await rightExpression.evaluate(scope);
  return f(context, leftValue, rightValue);
};

export const orOperator = evaluateLeft(or);
export const andOperator = evaluateLeft(and);

export const plusOperator = evaluateBoth(plus);
export const minusOperator = evaluateBoth(minus);
export const multiplyOperator = evaluateBoth(multiply);
export const divideOperator = evaluateBoth(divide);
export const moduloOperator = evaluateBoth(modulo);
export const equalsOperator = evaluateBoth(equals);
export const notEqualsOperator = evaluateBoth(notEquals);
export const lessThanOperator = evaluateBoth(lessThan);
export const greaterThanOperator = evaluateBoth(greaterThan);
export const lessThanOrEqualsOperator = evaluateBoth(lessThanOrEquals);
export const greaterThanOrEqualsOperator = evaluateBoth(greaterThanOrEquals);
