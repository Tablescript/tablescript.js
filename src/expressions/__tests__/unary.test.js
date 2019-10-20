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

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const expect = chai.expect;

import { createUnaryExpression } from '../unary';
import { createNumberLiteral } from '../number-literal';

describe('createUnaryExpression', () => {
  let mockLocation;

  beforeEach(() => {
    mockLocation = 'some location';
  });

  describe('evaluate', () => {
    let mockContext;
    let mockNumericValue;
    let mockBooleanValue;
    let mockArgument;

    beforeEach(() => {      
      mockContext = {
        setLocation: () => undefined,
        factory: {
          createNumericValue: n => n,
          createBooleanValue: b => b
        }
      };
      mockNumericValue = value => ({
        asNativeNumber: () => value
      });
      mockBooleanValue = value => ({
        asNativeBoolean: () => value
      });
      mockArgument = value => ({
        evaluate: () => Promise.resolve(value)
      });
    });

    it('evaluates a unary - to a negative numeric value', () => {
      const expression = createUnaryExpression(mockLocation, '-', mockArgument(mockNumericValue(12)));
      return expression.evaluate(mockContext).then(v => {
        expect(v).to.equal(-12);
      });
    });

    it('evaluates a unary + to an equivalent numeric value', () => {
      const expression = createUnaryExpression(mockLocation, '+', mockArgument(mockNumericValue(12)));
      return expression.evaluate(mockContext).then(v => {
        expect(v).to.equal(12);
      });
    });

    it('evaluates a unary not to an inverted boolean value', () => {
      const expression = createUnaryExpression(mockLocation, 'not', mockArgument(mockBooleanValue(true)));
      return expression.evaluate(mockContext).then(v => {
        expect(v).to.equal(false);
      });
    });
  });

  it('throws when evaluated as a lhs', () => {
    const expression = createUnaryExpression(mockLocation, '-', createNumberLiteral(12));
    expect(() => expression.evaluateAsLeftHandSide()).to.throw('Cannot assign to unary expression');
  });
});
