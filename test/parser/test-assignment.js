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

import { valueTypes } from '../../src/values/types';
import { createAssignmentExpression } from '../../src/parser/expressions';

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
    let calls;

    describe('with invalid lhs', () => {
      beforeEach(() => {
        mockLeftHandExpression = {
          evaluateAsLeftHandSide: () => ({
            type: valueTypes.UNDEFINED
          }),
        };
        expression = createAssignmentExpression({}, mockLeftHandExpression);
      });

      it('throws when evaluated', () => {
        expect(() => expression.evaluate({})).to.throw('Cannot assign to a non-left-hand-side type');
      });
    });

    describe('with valid lhs', () => {
      beforeEach(() => {
        calls = {};
        mockLeftHandValue = {
          type: valueTypes.LEFT_HAND_SIDE,
          assignFrom: (context, scope, value) => {
            recordCall(calls, 'assignFrom', [scope, value]);
          },
        };
        mockLeftHandExpression = {
          evaluateAsLeftHandSide: scope => {
            recordCall(calls, 'evaluateAsLeftHandSide', [scope]);
            return mockLeftHandValue;
          },
        };
        mockValue = 97;
        mockValueExpression = {
          evaluate: scope => {
            recordCall(calls, 'evaluate', [scope]);
            return mockValue;
          },
        };
        mockScope = {
          a: 1,
          b: 2,
          c: 3,
        };
        expression = createAssignmentExpression({}, mockLeftHandExpression, mockValueExpression);
      });

      it('evaluates the lhs as an lhs', () => {
        expression.evaluate({});
        expect(calls['evaluateAsLeftHandSide'].callCount).to.equal(1);
      });

      it('passes the proper scope to evaluateAsLeftHandSide', () => {
        expression.evaluate(mockScope);
        expect(calls['evaluateAsLeftHandSide'].args[0]).to.eql([mockScope]);
      });

      it('evalutes the value expression', () => {
        expression.evaluate({});
        expect(calls['evaluate'].callCount).to.equal(1);
      });

      it('passes the proper scope to evaluate', () => {
        expression.evaluate(mockScope);
        expect(calls['evaluate'].args[0]).to.eql([mockScope]);
      });

      it('delegates to the lhs value to assign', () => {
        expression.evaluate({});
        expect(calls['assignFrom'].callCount).to.equal(1);
      });

      it('passes the scope and value', () => {
        expression.evaluate(mockScope);
        expect(calls['assignFrom'].args[0]).to.eql([mockScope, mockValue]);
      });

      it('returns the value', () => {
        expect(expression.evaluate({})).to.equal(mockValue);
      });
    });
  });

  describe('evaluateAsLeftHandSide', () => {
    it('throws when evaluated as left hand side', () => {
      expect(() => expression.evaluateAsLeftHandSide()).to.throw('Cannot assign to assignment expression');
    });
  });

  describe('getReferencedSymbols', () => {
    let result;

    beforeEach(() => {
      mockLeftHandExpression = {
        getReferencedSymbols: () => [2, 4],
      };
      mockValueExpression = {
        getReferencedSymbols: () => [1, 3],
      };
      expression = createAssignmentExpression({}, mockLeftHandExpression, mockValueExpression);
      result = expression.getReferencedSymbols();
    });

    it('mixes the results of delegating to each of lhs and value expressions', () => {
      expect(result).to.eql([2, 4, 1, 3]);
    });
  });
});
