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

const or = (context, leftValue, rightExpression) => {
  if (leftValue.asNativeBoolean()) {
    return leftValue;
  }
  return rightExpression.evaluate(context);
};

const and = (context, leftValue, rightExpression) => {
  if (!leftValue.asNativeBoolean()) {
    return context.factory.createBooleanValue(false);
  }
  const rightValue = rightExpression.evaluate(context);
  return context.factory.createBooleanValue(rightValue.asNativeBoolean());
};

const plus = (context, leftValue, rightValue) => leftValue.add(context, rightValue);
const minus = (context, leftValue, rightValue) => leftValue.subtract(context, rightValue);
const multiply = (context, leftValue, rightValue) => leftValue.multiplyBy(context, rightValue);
const divide = (context, leftValue, rightValue) => leftValue.divideBy(context, rightValue);
const modulo = (context, leftValue, rightValue) => leftValue.modulo(context, rightValue);
const equals = (context, leftValue, rightValue) => context.factory.createBooleanValue(leftValue.nativeEquals(rightValue));
const notEquals = (context, leftValue, rightValue) => context.factory.createBooleanValue(!leftValue.nativeEquals(rightValue));
const lessThan = (context, leftValue, rightValue) => leftValue.lessThan(context, rightValue);
const greaterThan = (context, leftValue, rightValue) => leftValue.greaterThan(context, rightValue);
const lessThanOrEquals = (context, leftValue, rightValue) => leftValue.lessThanOrEquals(context, rightValue);
const greaterThanOrEquals = (context, leftValue, rightValue) => leftValue.greaterThanOrEquals(context, rightValue);

const evaluateLeft = f => (context, leftExpression, rightExpression) => {
  const leftValue = leftExpression.evaluate(context);
  return f(context, leftValue, rightExpression);
};

const evaluateBoth = f => (context, leftExpression, rightExpression) => {
  const leftValue = leftExpression.evaluate(context);
  const rightValue = rightExpression.evaluate(context);
  return f(context, leftValue, rightValue);
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
