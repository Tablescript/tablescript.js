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

  describe('json', () => {
    let expression;

    beforeEach(() => {
      const mockTestExpression = {
        json: () => 'mockTestExpression',
      };
      const mockConsequentExpression = {
        json: () => 'mockConsequentExpression',
      };
      const mockAlternateExpression = {
        json: () => 'mockAlternateExpression',
      };

      expression = createConditionalExpression({}, mockTestExpression, mockConsequentExpression, mockAlternateExpression);
    });

    it('returns a json-ified expression', () => {
      expect(expression.json()).to.eql({
        type: 'conditional',
        test: 'mockTestExpression',
        consequent: 'mockConsequentExpression',
        alternate: 'mockAlternateExpression',
      });
    });
  });
});
