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

import * as R from 'ramda';
import { createUnaryExpression } from '../unary';
import { createNumberLiteral } from '../number-literal';
import { createStringLiteral } from '../string-literal';
import { initializeContext } from '../../context';
import defaultValueFactory from '../../value-factory';
import '../../__tests__/matchers';
import { createBooleanLiteral } from '../boolean-literal';

describe('createUnaryExpression', () => {
  let mockContext;
  let mockLocation;

  beforeEach(() => {
    mockContext = initializeContext({}, {}, defaultValueFactory);
    mockLocation = 'some location';
  });

  describe('evaluate', () => {
    describe('unary -', () => {
      it('converts a positive numeric value into a negative one', () => {
        const expression = createUnaryExpression(mockLocation, '-', createNumberLiteral(12));
        expect(expression.evaluate(mockContext)).toEqualTsNumber(-12);
      });

      it('converts a negative numeric value into a positive one', () => {
        const expression = createUnaryExpression(mockLocation, '-', createNumberLiteral(-99));
        expect(expression.evaluate(mockContext)).toEqualTsNumber(99);
      });

      it('throws if expression cannot be evaluated as a number', () => {
        const expression = createUnaryExpression(mockLocation, '-', createStringLiteral('not a number'));
        expect(() => expression.evaluate(mockContext)).toThrow('Cannot treat STRING as NUMBER');
      });
    });

    describe('unary +', () => {
      it('leaves a positive number positive', () => {
        const expression = createUnaryExpression(mockLocation, '+', createNumberLiteral(12));
        expect(expression.evaluate(mockContext)).toEqualTsNumber(12);
      });

      it('leaves a negative number negative', () => {
        const expression = createUnaryExpression(mockLocation, '+', createNumberLiteral(-99));
        expect(expression.evaluate(mockContext)).toEqualTsNumber(-99);
      });

      it('throws if expression cannot be evaluated as a number', () => {
        const expression = createUnaryExpression(mockLocation, '+', createStringLiteral('not a number'));
        expect(() => expression.evaluate(mockContext)).toThrow('Cannot treat STRING as NUMBER');
      });
    });

    describe('unary not', () => {
      it('inverts a positive boolean value', () => {
        const expression = createUnaryExpression(mockLocation, 'not', createBooleanLiteral(true));
        expect(expression.evaluate(mockContext)).toEqualTsBoolean(false);
      });

      it('inverts a negative boolean value', () => {
        const expression = createUnaryExpression(mockLocation, 'not', createBooleanLiteral(false));
        expect(expression.evaluate(mockContext)).toEqualTsBoolean(true);
      });
    });

    it('throws if the operator is unrecognized', () => {
      const expression = createUnaryExpression(mockLocation, 'nope', createBooleanLiteral(true));
      expect(() => expression.evaluate(mockContext)).toThrow('Invalid operator "nope"');
    });
  });

  it('throws when evaluated as a lhs', () => {
    const expression = createUnaryExpression(mockLocation, '-', createNumberLiteral(12));
    expect(() => expression.evaluateAsLeftHandSide()).toThrow('Cannot assign to unary expression');
  });
});
