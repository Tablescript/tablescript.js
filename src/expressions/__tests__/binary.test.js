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
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const expect = chai.expect;

import { createBinaryExpression, createBinaryExpressionWithOperators } from '../binary';
import { numericValue } from '../../__tests__/util';
import { createNumericValue } from '../../values/numeric';
import { expressionTypes } from '../types';

xdescribe('createBinaryExpressionWithOperators', () => {
  let expression;
  let leftExpression;
  let rightExpression;
  let operators;

  beforeEach(() => {
    leftExpression = 'some expression';
    rightExpression = 'some other expression';
    operators = {
      '+': chai.spy(),
    };
    expression = createBinaryExpressionWithOperators(operators)('context', leftExpression, '+', rightExpression);
  });

  it('has the right type', () => {
    expect(expression.type).to.equal(expressionTypes.BINARY);
  });

  it('defers to the operator', () => {
    expression.evaluate('scope');
    expect(operators['+']).to.have.been.called.with('context', leftExpression, rightExpression, 'scope');
  });

  it('throws when evaluating as left-hand side', () => {
    expect(() => expression.evaluateAsLeftHandSide()).to.throw('Cannot assign to binary expression');
  });
});

describe('createBinaryExpression', () => {
  xit('evaluates', () => {
    const leftExpression = {
      evaluate: () => createNumericValue(9),
    };
    const rightExpression = {
      evaluate: () => createNumericValue(12),
    };
    const expression = createBinaryExpression({}, leftExpression, '+', rightExpression);
    return expect(expression.evaluate({})).to.eventually.satisfy(numericValue(21));
  });
});
