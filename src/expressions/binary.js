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

import R from 'ramda';
import { defaultExpression } from './default';
import { expressionTypes } from './types';
import {
  orOperator,
  andOperator,
  plusOperator,
  minusOperator,
  multiplyOperator,
  divideOperator,
  moduloOperator,
  equalsOperator,
  notEqualsOperator,
  lessThanOperator,
  greaterThanOperator,
  lessThanOrEqualsOperator,
  greaterThanOrEqualsOperator,
} from './binary-operators';
import { throwRuntimeError } from '../error';

const opTable = [
  ['or', orOperator],
  ['and', andOperator],
  ['+', plusOperator],
  ['-', minusOperator],
  ['*', multiplyOperator],
  ['/', divideOperator],
  ['%', moduloOperator],
  ['==', equalsOperator],
  ['!=', notEqualsOperator],
  ['<', lessThanOperator],
  ['>', greaterThanOperator],
  ['<=', lessThanOrEqualsOperator],
  ['>=', greaterThanOrEqualsOperator],
];

const knownOperator = operator => opTable.map(R.head).includes(operator);

const buildOperatorMap = (context, leftExpression, rightExpression) => {
  return opTable.reduce((opMap, op) => ({
    ...opMap,
    [op[0]]: op[1](context, leftExpression, rightExpression)
  }), {});
};

export const createBinaryExpression = (context, leftExpression, operator, rightExpression) => {

  if (!knownOperator(operator)) {
    throwRuntimeError(`Invalid operator ${operator}`, context);
  }

  const operators = buildOperatorMap(context, leftExpression, rightExpression);

  const evaluate = async scope => await operators[operator](scope);

  return {
    ...defaultExpression(expressionTypes.BINARY, evaluate)
  };
};
