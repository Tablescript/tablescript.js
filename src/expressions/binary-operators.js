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
import { valueTypes } from '../values/types';
import { throwRuntimeError } from '../error';

export const orOperator = (context, leftExpression, rightExpression) => async scope => {
  const leftValue = await leftExpression.evaluate(scope);
  if (leftValue.asNativeBoolean(context)) {
    return createBooleanValue(true);
  }
  const rightValue = await rightExpression.evaluate(scope);
  return createBooleanValue(rightValue.asNativeBoolean(context));
};

export const andOperator = (context, leftExpression, rightExpression) => async scope => {
  const leftValue = await leftExpression.evaluate(scope);
  if (!leftValue.asNativeBoolean(context)) {
    return createBooleanValue(false);
  }
  const rightValue = await rightExpression.evaluate(scope);
  return createBooleanValue(rightValue.asNativeBoolean(context));
};

const plus = (context, leftValue, rightValue) => {
  if (leftValue.type === valueTypes.STRING) {
    return createStringValue(leftValue.asNativeString(context) + rightValue.asNativeString(context));
  } else if (leftValue.type === valueTypes.NUMBER) {
    return createNumericValue(leftValue.asNativeNumber(context) + rightValue.asNativeNumber(context));
  }
  throwRuntimeError('Cannot add these values', context);
}

const minus = (context, leftValue, rightValue) => {
  if (leftValue.type === valueTypes.NUMBER && rightValue.type === valueTypes.NUMBER) {
    return createNumericValue(leftValue.asNativeNumber(context) - rightValue.asNativeNumber(context));
  }
  throwRuntimeError('Cannot subtract these values', context);
};

const multiply = (context, leftValue, rightValue) => {
  if (leftValue.type === valueTypes.NUMBER && rightValue.type === valueTypes.NUMBER) {
    return createNumericValue(leftValue.asNativeNumber(context) * rightValue.asNativeNumber(context));
  } else if (leftValue.type === valueTypes.STRING && rightValue.type === valueTypes.NUMBER) {
    return createStringValue(leftValue.asNativeString().repeat(rightValue.asNativeNumber()));
  }
  throwRuntimeError('Cannot multiply these values', context);
};

const divide = (context, leftValue, rightValue) => {
  if (rightValue.asNativeNumber(context) === 0) {
    throwRuntimeError('Divide by zero', context);
  }
  return createNumericValue(leftValue.asNativeNumber(context) / rightValue.asNativeNumber(context));
};

const modulo = (context, leftValue, rightValue) => {
  if (rightValue.asNativeNumber(context) === 0) {
    throwRuntimeError('Divide by zero', context);
  }
  return createNumericValue(leftValue.asNativeNumber(context) % rightValue.asNativeNumber(context));
};

const equals = (context, leftValue, rightValue) => {
  return createBooleanValue(leftValue.equals(context, rightValue));
};

const notEquals = (context, leftValue, rightValue) => {
  return createBooleanValue(!leftValue.equals(context, rightValue));
};

const lessThan = (context, leftValue, rightValue) => {
  return createBooleanValue(leftValue.asNativeNumber(context) < rightValue.asNativeNumber(context));
};

const greaterThan = (context, leftValue, rightValue) => {
  return createBooleanValue(leftValue.asNativeNumber(context) > rightValue.asNativeNumber(context));
};

const lessThanOrEquals = (context, leftValue, rightValue) => {
  return createBooleanValue(leftValue.asNativeNumber(context) <= rightValue.asNativeNumber(context));
};

const greaterThanOrEquals = (context, leftValue, rightValue) => {
  return createBooleanValue(leftValue.asNativeNumber(context) >= rightValue.asNativeNumber(context));
};

const evaluateBoth = f => (context, leftExpression, rightExpression) => async scope => {
  const leftValue = await leftExpression.evaluate(scope);
  const rightValue = await rightExpression.evaluate(scope);
  return f(context, leftValue, rightValue);
};

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
