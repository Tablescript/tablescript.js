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
import { defaultExpression } from './default';
import { expressionTypes } from './types';

export const createAssignmentExpression = (context, leftHandSideExpression, valueExpression) => {
  const evaluate = async scope => {
    const leftHandSideValue = await leftHandSideExpression.evaluateAsLeftHandSide(context, scope);
    if (leftHandSideValue.type !== valueTypes.LEFT_HAND_SIDE) {
      throwRuntimeError('Cannot assign to a non-left-hand-side type', context);
    }
    const value = await valueExpression.evaluate(scope);
    leftHandSideValue.assignFrom(context, scope, value);
    return value;
  };

  const getReferencedSymbols = () => {
    return [
      ...leftHandSideExpression.getReferencedSymbols(),
      ...valueExpression.getReferencedSymbols(),
    ];
  };

  return {
    ...defaultExpression(expressionTypes.ASSIGNMENT, evaluate, getReferencedSymbols),
  };
};
