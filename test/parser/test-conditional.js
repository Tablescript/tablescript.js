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

import chai from 'chai';
const expect = chai.expect;

import { createConditionalExpression } from '../../src/parser/expressions';

describe('createConditionalExpression', () => {
  describe('evaluate', () => {
    it('returns the consequent value when test expression is true', () => {
      const mockTestExpression = {
        evaluate: () => ({
          asNativeBoolean: () => true
        })
      };
      const mockConsequentExpression = {
        evaluate: () => 9
      };
      const expression = createConditionalExpression({}, mockTestExpression, mockConsequentExpression, undefined);
      expect(expression.evaluate({})).to.equal(9);
    });

    it('returns the alternate value when test expression is true', () => {
      const mockTestExpression = {
        evaluate: () => ({
          asNativeBoolean: () => false
        })
      };
      const mockAlternateExpression = {
        evaluate: () => 47
      };
      const expression = createConditionalExpression({}, mockTestExpression, undefined, mockAlternateExpression);
      expect(expression.evaluate({})).to.equal(47);
    });
  });

  it('throws when evaluated as a lhs', () => {
    const expression = createConditionalExpression({}, {}, {}, {});
    expect(() => expression.evaluateAsLeftHandSide()).to.throw('Cannot assign to conditional expression');
  });

  describe('getReferencedSymbols', () => {
    let expression;

    beforeEach(() => {
      const mockTestExpression = {
        getReferencedSymbols: () => [1, 2, 3],
      };
      const mockConsequentExpression = {
        getReferencedSymbols: () => [4, 5, 6],
      };
      const mockAlternateExpression = {
        getReferencedSymbols: () => [7, 8, 9],
      };

      expression = createConditionalExpression({}, mockTestExpression, mockConsequentExpression, mockAlternateExpression);
    });

    it('merges the results of deferring to each subexpression', () => {
      expect(expression.getReferencedSymbols()).to.eql([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });
  });
});
