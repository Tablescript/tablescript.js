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
import { createAssignmentExpression } from '../assignment';
import '../../__tests__/matchers';
import { initializeContext } from '../../context';
import defaultValueFactory from '../../value-factory';
import { createBooleanLiteral } from '../boolean-literal';
import { createVariableExpression } from '../variable';
import { createNumberLiteral } from '../number-literal';
import { createNumericValue } from '../../values/numeric';
import { createObjectLiteral } from '../object-literal';

describe('createAssignmentExpression', () => {
  let mockContext;

  beforeEach(() => {
    mockContext = initializeContext({}, {}, defaultValueFactory);
  });

  describe('evaluate', () => {
    describe('with invalid lhs', () => {
      it('throws when evaluated', () => {
        const expression = createAssignmentExpression({}, createBooleanLiteral(true));
        expect(() => expression.evaluate(mockContext)).toThrow('Cannot assign to boolean expression');
      });
    });

    describe('=', () => {
      let expression;

      beforeEach(() => {
        expression = createAssignmentExpression(mockContext, createVariableExpression('a'), '=', createNumberLiteral(12));
      });

      it('assigns', () => {
        expression.evaluate(mockContext);
        expect(mockContext.getVariable('a')).toEqualTsNumber(12);
      });

      it('returns the value', () => {
        expect(expression.evaluate(mockContext)).toEqualTsNumber(12);
      });
    });

    describe('+=', () => {
      let expression;

      beforeEach(() => {
        mockContext.setVariable('a', createNumericValue(9));
        expression = createAssignmentExpression(mockContext, createVariableExpression('a'), '+=', createNumberLiteral(12));
      });

      it('assigns', () => {
        expression.evaluate(mockContext);
        expect(mockContext.getVariable('a')).toEqualTsNumber(21);
      });

      it('returns the value', () => {
        expect(expression.evaluate(mockContext)).toEqualTsNumber(21);
      });

      it('throws if it cannot add the value', () => {
        expression = createAssignmentExpression(mockContext, createVariableExpression('a'), '+=', createObjectLiteral({}, []));
        expect(() => expression.evaluate(mockContext)).toThrow('Cannot treat OBJECT as NUMBER');
      });
    });

    describe('-=', () => {
      let expression;

      beforeEach(() => {
        mockContext.setVariable('a', createNumericValue(9));
        expression = createAssignmentExpression(mockContext, createVariableExpression('a'), '-=', createNumberLiteral(12));
      });

      it('assigns', () => {
        expression.evaluate(mockContext);
        expect(mockContext.getVariable('a')).toEqualTsNumber(-3);
      });

      it('returns the value', () => {
        expect(expression.evaluate(mockContext)).toEqualTsNumber(-3);
      });

      it('throws if it cannot subtract the value', () => {
        expression = createAssignmentExpression(mockContext, createVariableExpression('a'), '-=', createObjectLiteral({}, []));
        expect(() => expression.evaluate(mockContext)).toThrow('Cannot treat OBJECT as NUMBER');
      });
    });

    describe('*=', () => {
      let expression;

      beforeEach(() => {
        mockContext.setVariable('a', createNumericValue(9));
        expression = createAssignmentExpression(mockContext, createVariableExpression('a'), '*=', createNumberLiteral(12));
      });

      it('assigns', () => {
        expression.evaluate(mockContext);
        expect(mockContext.getVariable('a')).toEqualTsNumber(108);
      });

      it('returns the value', () => {
        expect(expression.evaluate(mockContext)).toEqualTsNumber(108);
      });

      it('throws if it cannot multiply the value', () => {
        expression = createAssignmentExpression(mockContext, createVariableExpression('a'), '*=', createObjectLiteral({}, []));
        expect(() => expression.evaluate(mockContext)).toThrow('Cannot treat OBJECT as NUMBER');
      });
    });

    describe('/=', () => {
      let expression;

      beforeEach(() => {
        mockContext.setVariable('a', createNumericValue(12));
        expression = createAssignmentExpression(mockContext, createVariableExpression('a'), '/=', createNumberLiteral(3));
      });

      it('assigns', () => {
        expression.evaluate(mockContext);
        expect(mockContext.getVariable('a')).toEqualTsNumber(4);
      });

      it('returns the value', () => {
        expect(expression.evaluate(mockContext)).toEqualTsNumber(4);
      });

      it('throws if it cannot divide the value', () => {
        expression = createAssignmentExpression(mockContext, createVariableExpression('a'), '/=', createObjectLiteral({}, []));
        expect(() => expression.evaluate(mockContext)).toThrow('Cannot treat OBJECT as NUMBER');
      });

      it('throws if the value is zero', () => {
        expression = createAssignmentExpression(mockContext, createVariableExpression('a'), '/=', createNumberLiteral(0));
        expect(() => expression.evaluate(mockContext)).toThrow('Divide by zero');
      });
    });

    describe('%=', () => {
      let expression;

      beforeEach(() => {
        mockContext.setVariable('a', createNumericValue(12));
        expression = createAssignmentExpression(mockContext, createVariableExpression('a'), '%=', createNumberLiteral(5));
      });

      it('assigns', () => {
        expression.evaluate(mockContext);
        expect(mockContext.getVariable('a')).toEqualTsNumber(2);
      });

      it('returns the value', () => {
        expect(expression.evaluate(mockContext)).toEqualTsNumber(2);
      });

      it('throws if it cannot divide the value', () => {
        expression = createAssignmentExpression(mockContext, createVariableExpression('a'), '%=', createObjectLiteral({}, []));
        expect(() => expression.evaluate(mockContext)).toThrow('Cannot treat OBJECT as NUMBER');
      });

      it('throws if the value is zero', () => {
        expression = createAssignmentExpression(mockContext, createVariableExpression('a'), '%=', createNumberLiteral(0));
        expect(() => expression.evaluate(mockContext)).toThrow('Divide by zero');
      });
    });

    it('throws if the operator is invalid', () => {
      const expression = createAssignmentExpression(mockContext, createVariableExpression('a'), 'nope', createNumberLiteral(9));
      expect(() => expression.evaluate(mockContext)).toThrow('Unknown operator "nope"');
    });
  });

  describe('evaluateAsLeftHandSide', () => {
    it('throws when evaluated as left hand side', () => {
      const expression = createAssignmentExpression({}, {}, {}, {});
      expect(() => expression.evaluateAsLeftHandSide()).toThrow('Cannot assign to assignment expression');
    });
  });
});
