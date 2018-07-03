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

import { allOperators } from '../binary-operators';
import { isBooleanValue, isNumericValue } from '../../__tests__/util';
import { createNumericValue } from '../../values/numeric';
import { createBooleanValue } from '../../values/boolean';

describe('binary-operators', () => {
  let operator;
    
  describe('orOperator', () => {
    const truthTable = [
      [false, false, false],
      [false, true, true],
      [true, false, true],
      [true, true, true]
    ];

    beforeEach(() => {
      operator = allOperators['or'];
    });

    truthTable.forEach(([a, b, expected]) => {
      it(`returns ${expected} for ${a} or ${b}`, () => {
        const leftExpression = {
          evaluate: () => createBooleanValue(a),
        };
        const rightExpression = {
          evaluate: () => createBooleanValue(b),
        };
        return expect(operator({}, leftExpression, rightExpression, {})).to.eventually.satisfy(isBooleanValue(expected));
      });
    });

    it('does not evaluate right side if left side true', () => {
      const leftExpression = {
        evaluate: () => createBooleanValue(true),
      };
      const rightExpression = {
        evaluate: chai.spy(),
      };
      return operator({}, leftExpression, rightExpression, {}).then(() => expect(rightExpression.evaluate).not.to.have.been.called());
    });
  });

  describe('andOperator', () => {
    const truthTable = [
      [false, false, false],
      [false, true, false],
      [true, false, false],
      [true, true, true]
    ];

    beforeEach(() => {
      operator = allOperators['and'];
    });

    truthTable.forEach(([a, b, expected]) => {
      it(`returns ${expected} for ${a} and ${b}`, () => {
        const leftExpression = {
          evaluate: () => createBooleanValue(a),
        };
        const rightExpression = {
          evaluate: () => createBooleanValue(b),
        };
        return expect(operator({}, leftExpression, rightExpression, {})).to.eventually.satisfy(isBooleanValue(expected));
      });
    });

    it('does not evaluate right side if left side false', () => {
      const leftExpression = {
        evaluate: () => createBooleanValue(false),
      };
      const rightExpression = {
        evaluate: chai.spy(),
      };
      return operator({}, leftExpression, rightExpression, {}).then(() => expect(rightExpression.evaluate).not.to.have.been.called());
    });
  });

  describe('math operators', () => {
    let mockContext;
    let leftValue;
    let leftExpression;
    let rightValue;
    let rightExpression;

    beforeEach(() => {
      mockContext = {};
      leftValue = createNumericValue(27);
      leftExpression = {
        evaluate: () => leftValue,
      };
      rightValue = createNumericValue(9);
      rightExpression = {
        evaluate: () => rightValue,
      };
    });

    describe('plusOperator', () => {
      beforeEach(() => {
        operator = allOperators['+'];
      });
  
      it('defers to the left value add()', () => {
        chai.spy.on(leftValue, 'add');
        return operator(mockContext, leftExpression, rightExpression, {}).then(() => expect(leftValue.add).to.have.been.called.with(mockContext, rightValue));
      });

      it('adds the operands', () => {
        return expect(operator(mockContext, leftExpression, rightExpression, {})).to.eventually.satisfy(isNumericValue(36));
      });
    });

    describe('minusOperator', () => {
      beforeEach(() => {
        operator = allOperators['-'];
      });
  
      it('defers to the left value subtract()', () => {
        chai.spy.on(leftValue, 'subtract');
        return operator(mockContext, leftExpression, rightExpression, {}).then(() => expect(leftValue.subtract).to.have.been.called.with(mockContext, rightValue));
      });

      it('subtracts the operands', () => {
        return expect(operator(mockContext, leftExpression, rightExpression, {})).to.eventually.satisfy(isNumericValue(18));
      });
    });

    describe('multiplyOperator', () => {
      beforeEach(() => {
        operator = allOperators['*'];
      });
  
      it('defers to the left value multiplyBy()', () => {
        chai.spy.on(leftValue, 'multiplyBy');
        return operator(mockContext, leftExpression, rightExpression, {}).then(() => expect(leftValue.multiplyBy).to.have.been.called.with(mockContext, rightValue));
      });

      it('multiplies the operands', () => {
        return expect(operator(mockContext, leftExpression, rightExpression, {})).to.eventually.satisfy(isNumericValue(243));
      });
    });

    describe('divideOperator', () => {
      beforeEach(() => {
        operator = allOperators['/'];
      });
  
      it('defers to the left value divideBy()', () => {
        chai.spy.on(leftValue, 'divideBy');
        return operator(mockContext, leftExpression, rightExpression, {}).then(() => expect(leftValue.divideBy).to.have.been.called.with(mockContext, rightValue));
      });

      it('divides the operands', () => {
        return expect(operator(mockContext, leftExpression, rightExpression, {})).to.eventually.satisfy(isNumericValue(3));
      });
    });

    describe('moduloOperator', () => {
      beforeEach(() => {
        operator = allOperators['%'];
      });
  
      it('defers to the left value modulo()', () => {
        chai.spy.on(leftValue, 'modulo');
        return operator(mockContext, leftExpression, rightExpression, {}).then(() => expect(leftValue.modulo).to.have.been.called.with(mockContext, rightValue));
      });

      it('modulos the operands', () => {
        return expect(operator(mockContext, leftExpression, rightExpression, {})).to.eventually.satisfy(isNumericValue(0));
      });
    });
  });
});
