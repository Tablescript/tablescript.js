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
import { createNumericValue } from '../numeric';
import { valueTypes } from '../types';
import { createStringValue } from '../string';
import { createArrayValue } from '../array';
import { initializeContext } from '../../context';
import defaultValueFactory from '../../value-factory';
require('../../__tests__/matchers');

describe('numeric value', () => {
  let mockContext;
  let value;

  beforeEach(() => {
    mockContext = initializeContext({}, {}, defaultValueFactory);
  });

  describe('non-zero', () => {
    beforeEach(() => {
      value = createNumericValue(9);
    });

    it('has type NUMBER', () => {
      expect(value.type).toEqual(valueTypes.NUMBER);
    });

    it('has a native value', () => {
      expect(value.asNativeValue()).toEqual(9);
    });

    it('is identical to the same number', () => {
      expect(value.identicalTo(createNumericValue(9))).toBeTruthy();
    });

    it('is not identical to a different number', () => {
      expect(value.identicalTo(createNumericValue(777))).toBeFalsy();
    });

    it('is not identical to a string', () => {
      expect(value.identicalTo(createStringValue('nope'))).toBeFalsy();
    });

    it('has its own value', () => {
      expect(value.asNativeNumber()).toEqual(9);
    });

    it('has its own value in a string', () => {
      expect(value.asNativeString()).toEqual('9');
    });

    it('is true', () => {
      expect(value.asNativeBoolean()).toEqual(true);
    });

    it('cannot be converted to array', () => {
      expect(() => value.asNativeArray()).toThrow('Cannot treat NUMBER as ARRAY');
    });

    it('cannot be converted to object', () => {
      expect(() => value.asNativeObject()).toThrow('Cannot treat NUMBER as OBJECT');
    });

    describe('equivalency', () => {
      it('is equal to its own value', () => {
        expect(value.nativeEquals(createNumericValue(9))).toBeTruthy();
      });

      it('is not equal to a different value', () => {
        expect(value.nativeEquals(createNumericValue(9999))).toBeFalsy();
      });
    });

    it('cannot be converted to array', () => {
      expect(() => value.asArray()).toThrow('Cannot treat NUMBER as ARRAY');
    });

    it('cannot be converted to object', () => {
      expect(() => value.asObject()).toThrow('Cannot treat NUMBER as OBJECT');
    });

    it('throws when asked to get a property', () => {
      expect(() => value.getProperty(mockContext, createStringValue('anything'))).toThrow('Cannot get property of NUMBER');
    });

    it('throws when asked to set a property', () => {
      expect(() => value.setProperty(mockContext, createStringValue('anything'))).toThrow('Cannot set property of NUMBER');
    });

    it('throws when asked to get element', () => {
      expect(() => value.getElement(mockContext, createStringValue('anything'))).toThrow('Cannot get element of NUMBER');
    });

    it('throws when called', () => {
      expect(() => value.callFunction()).toThrow('NUMBER is not callable');
    });

    describe('adding', () => {
      it('converts to string when added to a string', () => {
        expect(value.add(mockContext, createStringValue('abc'))).toEqualTsString('9abc');
      });

      it('adds other numbers', () => {
        expect(value.add(mockContext, createNumericValue(90))).toEqualTsNumber(99);
      });

      it('throws when adding anything else', () => {
        expect(() => value.add(mockContext, createArrayValue([createNumericValue(1), createNumericValue(2)])))
          .toThrow('Cannot treat ARRAY as NUMBER');
      });
    });

    describe('subtract', () => {
      it('subtracts other numbers', () => {
        expect(value.subtract(mockContext, createNumericValue(4))).toEqualTsNumber(5);
      });

      it('throws when subtracting anything else', () => {
        expect(() => value.subtract(mockContext, createStringValue('4'))).toThrow('Cannot treat STRING as NUMBER');
      });
    });

    describe('multiply by', () => {
      it('multiplies by other numbers', () => {
        expect(value.multiplyBy(mockContext, createNumericValue(4))).toEqualTsNumber(36);
      });

      it('throws when multiplying by anything else', () => {
        expect(() => value.multiplyBy(mockContext, createStringValue('4'))).toThrow('Cannot treat STRING as NUMBER');
      });
    });

    describe('divide by', () => {
      it('divides by other numbers', () => {
        expect(value.divideBy(mockContext, createNumericValue(3))).toEqualTsNumber(3);
      });

      it('even floats', () => {
        expect(value.divideBy(mockContext, createNumericValue(2))).toEqualTsNumber(4.5);
      });

      it('throws when dividing by 0', () => {
        expect(() => value.divideBy(mockContext, createNumericValue(0))).toThrow('Divide by zero');
      });

      it('throws when dividing by anything else', () => {
        expect(() => value.divideBy(mockContext, createStringValue('2'))).toThrow('Cannot treat STRING as NUMBER');
      });
    });

    describe('modulo', () => {
      it('modulos other numbers', () => {
        expect(value.modulo(mockContext, createNumericValue(4))).toEqualTsNumber(1);
      });

      it('throws when modulo-ing 0', () => {
        expect(() => value.divideBy(mockContext, createNumericValue(0))).toThrow('Divide by zero');
      });

      it('throws when modulo-ing anything else', () => {
        expect(() => value.divideBy(mockContext, createStringValue('4'))).toThrow('Cannot treat STRING as NUMBER');
      });
    });

    describe('less than', () => {
      it('compares larger values', () => {
        expect(value.lessThan(mockContext, createNumericValue(100))).toEqualTsBoolean(true);
      });

      it('compares equal values', () => {
        expect(value.lessThan(mockContext, createNumericValue(9))).toEqualTsBoolean(false);
      });

      it('compares smaller values', () => {
        expect(value.lessThan(mockContext, createNumericValue(1))).toEqualTsBoolean(false);
      });

      it('throws when comparing anything else', () => {
        expect(() => value.lessThan(mockContext, createStringValue('100'))).toThrow('Cannot treat STRING as NUMBER');
      });
    });

    describe('greater than', () => {
      it('compares larger values', () => {
        expect(value.greaterThan(mockContext, createNumericValue(100))).toEqualTsBoolean(false);
      });

      it('compares equal values', () => {
        expect(value.greaterThan(mockContext, createNumericValue(9))).toEqualTsBoolean(false);
      });

      it('compares smaller values', () => {
        expect(value.greaterThan(mockContext, createNumericValue(1))).toEqualTsBoolean(true);
      });

      it('throws when comparing anything else', () => {
        expect(() => value.greaterThan(mockContext, createStringValue('100'))).toThrow('Cannot treat STRING as NUMBER');
      });
    });

    describe('less than or equal', () => {
      it('compares larger values', () => {
        expect(value.lessThanOrEquals(mockContext, createNumericValue(100))).toEqualTsBoolean(true);
      });

      it('compares equal values', () => {
        expect(value.lessThanOrEquals(mockContext, createNumericValue(9))).toEqualTsBoolean(true);
      });

      it('compares smaller values', () => {
        expect(value.lessThanOrEquals(mockContext, createNumericValue(1))).toEqualTsBoolean(false);
      });

      it('throws when comparing anything else', () => {
        expect(() => value.lessThanOrEquals(mockContext, createStringValue('100'))).toThrow('Cannot treat STRING as NUMBER');
      });
    });

    describe('greater than or equal', () => {
      it('compares larger values', () => {
        expect(value.greaterThanOrEquals(mockContext, createNumericValue(100))).toEqualTsBoolean(false);
      });

      it('compares equal values', () => {
        expect(value.greaterThanOrEquals(mockContext, createNumericValue(9))).toEqualTsBoolean(true);
      });

      it('compares smaller values', () => {
        expect(value.greaterThanOrEquals(mockContext, createNumericValue(1))).toEqualTsBoolean(true);
      });

      it('throws when comparing anything else', () => {
        expect(() => value.greaterThanOrEquals(mockContext, createStringValue('100'))).toThrow('Cannot treat STRING as NUMBER');
      });
    });
  });

  describe('zero', () => {
    beforeEach(() => {
      value = createNumericValue(0);
    });

    it('has type NUMBER', () => {
      expect(value.type).toEqual(valueTypes.NUMBER);
    });

    it('has numeric value 0', () => {
      expect(value.asNativeNumber()).toEqual(0);
    });

    it('has string value "0"', () => {
      expect(value.asNativeString()).toEqual('0');
    });

    it('has boolean value false', () => {
      expect(value.asNativeBoolean()).toEqual(false);
    });
  });
});
