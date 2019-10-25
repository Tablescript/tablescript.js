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
import { createBinaryExpression } from '../binary';
import { initializeContext } from '../../context';
import defaultValueFactory from '../../value-factory';
import { createBooleanLiteral } from '../boolean-literal';
import { createObjectLiteral } from '../object-literal';
import { createNumberLiteral } from '../number-literal';
import '../../__tests__/matchers';
import { createStringLiteral } from '../string-literal';

describe('createBinaryExpression', () => {
  let mockContext;

  beforeEach(() => {
    mockContext = initializeContext({}, {}, defaultValueFactory);
  });

  describe('or', () => {
    [
      [true, true, true],
      [true, false, true],
      [false, true, true],
      [false, false, false],
    ].forEach(([a, b, c]) => {
      it(`${a} or ${b} = ${c}`, () => {
        const expression = createBinaryExpression({}, createBooleanLiteral(a), 'or', createBooleanLiteral(b));
        expect(expression.evaluate(mockContext)).toEqualTsBoolean(c);
      });
    });
  });

  describe('and', () => {
    [
      [true, true, true],
      [true, false, false],
      [false, true, false],
      [false, false, false],
    ].forEach(([a, b, c]) => {
      it(`${a} and ${b} = ${c}`, () => {
        const expression = createBinaryExpression({}, createBooleanLiteral(a), 'and', createBooleanLiteral(b));
        expect(expression.evaluate(mockContext)).toEqualTsBoolean(c);
      });
    });
  });

  describe('+', () => {
    it('adds values', () => {
      const expression = createBinaryExpression({}, createNumberLiteral(9), '+', createNumberLiteral(12));
      expect(expression.evaluate(mockContext)).toEqualTsNumber(21);
    });

    it('throws if values cannot be added', () => {
      const expression = createBinaryExpression({}, createNumberLiteral(9), '+', createObjectLiteral({}, []));
      expect(() => expression.evaluate(mockContext)).toThrow('Cannot treat OBJECT as NUMBER');
    });
  });

  describe('-', () => {
    it('subtracts values', () => {
      const expression = createBinaryExpression({}, createNumberLiteral(9), '-', createNumberLiteral(12));
      expect(expression.evaluate(mockContext)).toEqualTsNumber(-3);
    });

    it('throws if values cannot be subtracted', () => {
      const expression = createBinaryExpression({}, createNumberLiteral(9), '-', createObjectLiteral({}, []));
      expect(() => expression.evaluate(mockContext)).toThrow('Cannot treat OBJECT as NUMBER');
    });
  });

  describe('*', () => {
    it('multiplies values', () => {
      const expression = createBinaryExpression({}, createNumberLiteral(9), '*', createNumberLiteral(12));
      expect(expression.evaluate(mockContext)).toEqualTsNumber(108);
    });

    it('throws if values cannot be multiplied', () => {
      const expression = createBinaryExpression({}, createNumberLiteral(9), '*', createObjectLiteral({}, []));
      expect(() => expression.evaluate(mockContext)).toThrow('Cannot treat OBJECT as NUMBER');
    });
  });

  describe('/', () => {
    it('divides values', () => {
      const expression = createBinaryExpression({}, createNumberLiteral(12), '/', createNumberLiteral(3));
      expect(expression.evaluate(mockContext)).toEqualTsNumber(4);
    });

    it('throws if values cannot be divided', () => {
      const expression = createBinaryExpression({}, createNumberLiteral(9), '/', createObjectLiteral({}, []));
      expect(() => expression.evaluate(mockContext)).toThrow('Cannot treat OBJECT as NUMBER');
    });

    it('throws if dividing by zero', () => {
      const expression = createBinaryExpression({}, createNumberLiteral(9), '/', createNumberLiteral(0));
      expect(() => expression.evaluate(mockContext)).toThrow('Divide by zero');
    });
  });

  describe('%', () => {
    it('modulos values', () => {
      const expression = createBinaryExpression({}, createNumberLiteral(12), '%', createNumberLiteral(5));
      expect(expression.evaluate(mockContext)).toEqualTsNumber(2);
    });

    it('throws if values cannot be divided', () => {
      const expression = createBinaryExpression({}, createNumberLiteral(9), '%', createObjectLiteral({}, []));
      expect(() => expression.evaluate(mockContext)).toThrow('Cannot treat OBJECT as NUMBER');
    });

    it('throws if dividing by zero', () => {
      const expression = createBinaryExpression({}, createNumberLiteral(9), '%', createNumberLiteral(0));
      expect(() => expression.evaluate(mockContext)).toThrow('Divide by zero');
    });
  });

  describe('==', () => {
    it('compares like values', () => {
      const expression = createBinaryExpression({}, createNumberLiteral(12), '==', createNumberLiteral(12));
      expect(expression.evaluate(mockContext)).toEqualTsBoolean(true);
    });

    it('compares unlike values', () => {
      const expression = createBinaryExpression({}, createNumberLiteral(12), '==', createStringLiteral('nope'));
      expect(expression.evaluate(mockContext)).toEqualTsBoolean(false);
    });
  });

  describe('!=', () => {
    it('compares unlike values', () => {
      const expression = createBinaryExpression({}, createNumberLiteral(12), '!=', createStringLiteral('nope'));
      expect(expression.evaluate(mockContext)).toEqualTsBoolean(true);
    });
    
    it('compares like values', () => {
      const expression = createBinaryExpression({}, createNumberLiteral(12), '!=', createNumberLiteral(12));
      expect(expression.evaluate(mockContext)).toEqualTsBoolean(false);
    });
  });

  describe('<', () => {
    it('compares lower values', () => {
      const expression = createBinaryExpression({}, createNumberLiteral(12), '<', createNumberLiteral(1000000));
      expect(expression.evaluate(mockContext)).toEqualTsBoolean(true);
    });
    
    it('compares equal values', () => {
      const expression = createBinaryExpression({}, createNumberLiteral(12), '<', createNumberLiteral(12));
      expect(expression.evaluate(mockContext)).toEqualTsBoolean(false);
    });

    it('compares higher values', () => {
      const expression = createBinaryExpression({}, createNumberLiteral(1000000), '<', createNumberLiteral(12));
      expect(expression.evaluate(mockContext)).toEqualTsBoolean(false);
    });

    it('throws if values cannot be compared', () => {
      const expression = createBinaryExpression({}, createNumberLiteral(9), '<', createObjectLiteral({}, []));
      expect(() => expression.evaluate(mockContext)).toThrow('Cannot treat OBJECT as NUMBER');
    });
  });

  describe('>', () => {
    it('compares lower values', () => {
      const expression = createBinaryExpression({}, createNumberLiteral(12), '>', createNumberLiteral(1000000));
      expect(expression.evaluate(mockContext)).toEqualTsBoolean(false);
    });
    
    it('compares equal values', () => {
      const expression = createBinaryExpression({}, createNumberLiteral(12), '>', createNumberLiteral(12));
      expect(expression.evaluate(mockContext)).toEqualTsBoolean(false);
    });

    it('compares higher values', () => {
      const expression = createBinaryExpression({}, createNumberLiteral(1000000), '>', createNumberLiteral(12));
      expect(expression.evaluate(mockContext)).toEqualTsBoolean(true);
    });

    it('throws if values cannot be compared', () => {
      const expression = createBinaryExpression({}, createNumberLiteral(9), '>', createObjectLiteral({}, []));
      expect(() => expression.evaluate(mockContext)).toThrow('Cannot treat OBJECT as NUMBER');
    });
  });

  describe('<=', () => {
    it('compares lower values', () => {
      const expression = createBinaryExpression({}, createNumberLiteral(12), '<=', createNumberLiteral(1000000));
      expect(expression.evaluate(mockContext)).toEqualTsBoolean(true);
    });
    
    it('compares equal values', () => {
      const expression = createBinaryExpression({}, createNumberLiteral(12), '<=', createNumberLiteral(12));
      expect(expression.evaluate(mockContext)).toEqualTsBoolean(true);
    });

    it('compares higher values', () => {
      const expression = createBinaryExpression({}, createNumberLiteral(1000000), '<=', createNumberLiteral(12));
      expect(expression.evaluate(mockContext)).toEqualTsBoolean(false);
    });

    it('throws if values cannot be compared', () => {
      const expression = createBinaryExpression({}, createNumberLiteral(9), '<=', createObjectLiteral({}, []));
      expect(() => expression.evaluate(mockContext)).toThrow('Cannot treat OBJECT as NUMBER');
    });
  });

  describe('>=', () => {
    it('compares lower values', () => {
      const expression = createBinaryExpression({}, createNumberLiteral(12), '>=', createNumberLiteral(1000000));
      expect(expression.evaluate(mockContext)).toEqualTsBoolean(false);
    });
    
    it('compares equal values', () => {
      const expression = createBinaryExpression({}, createNumberLiteral(12), '>=', createNumberLiteral(12));
      expect(expression.evaluate(mockContext)).toEqualTsBoolean(true);
    });

    it('compares higher values', () => {
      const expression = createBinaryExpression({}, createNumberLiteral(1000000), '>=', createNumberLiteral(12));
      expect(expression.evaluate(mockContext)).toEqualTsBoolean(true);
    });

    it('throws if values cannot be compared', () => {
      const expression = createBinaryExpression({}, createNumberLiteral(9), '>=', createObjectLiteral({}, []));
      expect(() => expression.evaluate(mockContext)).toThrow('Cannot treat OBJECT as NUMBER');
    });
  });
});
