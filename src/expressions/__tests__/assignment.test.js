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
import spies from 'chai-spies-next';
chai.use(chaiAsPromised);
chai.use(spies);
const expect = chai.expect;

import { valueTypes } from '../../values/types';
import { createAssignmentExpression } from '../assignment';
import { isBooleanValue, isNumericValue, isStringValue } from '../../__tests__/util';

const recordCall = (calls, name, args = []) => {
  if (calls[name]) {
    calls[name] = {
      callCount: calls[name].callCount + 1,
      args: [...calls[name].args, args]
    };
  } else {
    calls[name] = {
      callCount: 1,
      args: [args]
    };
  }
}
describe('createAssignmentExpression', () => {
  let mockLeftHandExpression;
  let mockValueExpression;
  let expression;

  describe('evaluate', () => {
    let mockLeftHandValue;
    let mockValue;
    let mockScope;
    let mockContext;

    describe('with invalid lhs', () => {
      beforeEach(() => {
        mockLeftHandExpression = {
          evaluateAsLeftHandSide: () => ({
            type: valueTypes.UNDEFINED
          }),
        };
        expression = createAssignmentExpression({}, mockLeftHandExpression);
      });

      it('throws when evaluated', done => {
        expect(expression.evaluate({})).to.eventually.be.rejectedWith('Cannot assign to a non-left-hand-side type').and.notify(done);
      });
    });

    describe('with valid lhs', () => {
      beforeEach(() => {
        mockLeftHandValue = {
          type: valueTypes.LEFT_HAND_SIDE,
          assignFrom: (context, scope, value) => undefined
        };
        mockLeftHandExpression = {
          evaluateAsLeftHandSide: () => mockLeftHandValue
        };
        mockValue = 97;
        mockValueExpression = {
          evaluate: scope => mockValue
        };
        mockScope = {
          a: 1,
          b: 2,
          c: 3,
        };
        mockContext = {
          d: 4
        };
        expression = createAssignmentExpression(mockContext, mockLeftHandExpression, '=', mockValueExpression);
      });

      it('evaluates the lhs as an lhs', () => {
        chai.spy.on(mockLeftHandExpression, 'evaluateAsLeftHandSide');
        return expression.evaluate(mockScope).then(() => {
          expect(mockLeftHandExpression.evaluateAsLeftHandSide).to.have.been.called.with(mockContext, mockScope);
        });
      });

      it('evalutes the value expression', () => {
        chai.spy.on(mockValueExpression, 'evaluate');
        return expression.evaluate(mockScope).then(() => {
          expect(mockValueExpression.evaluate).to.have.been.called.with(mockScope);
        });
      });

      it('delegates to the lhs value to assign', () => {
        chai.spy.on(mockLeftHandValue, 'assignFrom');
        return expression.evaluate(mockScope).then(() => {
          expect(mockLeftHandValue.assignFrom).to.have.been.called.with(mockContext, mockScope, mockValue);
        });
      });

      it('returns the value', () => {
        return expect(expression.evaluate(mockScope)).to.eventually.equal(mockValue);
      });
    });
  });

  describe('evaluateAsLeftHandSide', () => {
    it('throws when evaluated as left hand side', () => {
      expect(() => expression.evaluateAsLeftHandSide()).to.throw('Cannot assign to assignment expression');
    });
  });
});
