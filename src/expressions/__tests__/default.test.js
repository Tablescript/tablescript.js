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


import { createExpression } from '../default';
import { expressionTypes } from '../types';

describe('createExpression', () => {
  let expression;

  beforeEach(() => {
    expression = createExpression(expressionTypes.BOOLEAN, 'some function');
  });

  it('stores the type', () => {
    expect(expression.type).toEqual(expressionTypes.BOOLEAN);
  });

  it('stores the evaluate function', () => {
    expect(expression.evaluate).toEqual('some function');
  });

  it('throws when evaluating as a left-hand side', () => {
    expect(() => expression.evaluateAsLeftHandSide()).toThrow('Cannot assign to boolean expression');
  });

  describe('with an evaluateAsLeftHandSide parameter', () => {
    beforeEach(() => {
      expression = createExpression(expressionTypes.BOOLEAN, 'some function', 'some other function');
    });

    it('stores the evaluateAsLeftHandSide function', () => {
      expect(expression.evaluateAsLeftHandSide).toEqual('some other function');
    });
  });
});
