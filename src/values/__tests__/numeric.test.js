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

import { createNumericValue } from '../numeric';
import { stringValue, numericValue } from '../../__tests__/util';
import { valueTypes } from '../types';
import { createStringValue } from '../string';
import { createArrayValue } from '../array';

describe('numeric value', () => {
  let value;

  describe('non-zero', () => {
    beforeEach(() => {
      value = createNumericValue(9);
    });

    it('has type NUMBER', () => {
      expect(value.type).to.equal(valueTypes.NUMBER);
    });

    it('has a native value', () => {
      expect(value.asNativeValue()).to.equal(9);
    });

    it('is identical to the same number', () => {
      expect(value.identicalTo(createNumericValue(9))).to.be.true;
    });

    it('is not identical to a different number', () => {
      expect(value.identicalTo(createNumericValue(777))).to.be.false;
    });

    it('is not identical to a string', () => {
      expect(value.identicalTo(createStringValue('nope'))).to.be.false;
    });

    it('has its own value', () => {
      expect(value.asNativeNumber()).to.equal(9);
    });

    it('has its own value in a string', () => {
      expect(value.asNativeString()).to.equal('9');
    });

    it('is true', () => {
      expect(value.asNativeBoolean()).to.be.true;
    });

    it('cannot be converted to array', () => {
      expect(() => value.asNativeArray()).to.throw('Cannot treat NUMBER as ARRAY');
    });

    it('cannot be converted to object', () => {
      expect(() => value.asNativeObject()).to.throw('Cannot treat NUMBER as OBJECT');
    });

    describe('equivalency', () => {
      it('is equal to its own value', () => {
        expect(value.nativeEquals(createNumericValue(9))).to.be.true;
      });

      it('is not equal to a different value', () => {
        expect(value.nativeEquals(createNumericValue(9999))).to.be.false;
      });
    });

    it('cannot be converted to array', () => {
      expect(() => value.asArray({})).to.throw('Cannot treat NUMBER as ARRAY');
    });

    it('cannot be converted to object', () => {
      expect(() => value.asObject({})).to.throw('Cannot treat NUMBER as OBJECT');
    });

    it('throws when asked to get a property', () => {
      expect(() => value.getProperty({}, 'anything')).to.throw('Cannot get property of NUMBER');
    });

    it('throws when asked to set a property', () => {
      expect(() => value.setProperty({}, 'anything')).to.throw('Cannot set property of NUMBER');
    });

    it('throws when asked to get element', () => {
      expect(() => value.getElement({}, 'anything')).to.throw('Cannot get element of NUMBER');
    });

    it('throws when called', () => {
      expect(() => value.callFunction()).to.throw('NUMBER is not callable');
    });

    describe('adding', () => {
      let context;

      beforeEach(() => {
        context = {
          factory: {
            createStringValue,
          }
        };
      });

      it('converts to string when added to a string', () => {
        expect(value.add(context, createStringValue('abc'))).to.satisfy(stringValue('9abc'));
      });

      it('adds other numbers', () => {
        expect(value.add(context, createNumericValue(90))).to.satisfy(numericValue(99));
      });

      it('throws when adding anything else', () => {
        expect(() => value.add(context, createArrayValue([createNumericValue(1), createNumericValue(2)]))).to.throw('Cannot treat ARRAY as NUMBER');
      });
    });

    describe('subtract', () => {
      it('subtracts other numbers', () => {
        expect(value.subtract({}, createNumericValue(4))).to.satisfy(numericValue(5));
      });

      it('throws when subtracting anything else', () => {
        expect(() => value.subtract({}, createStringValue('4'))).to.throw('Cannot treat STRING as NUMBER');
      });
    });

    describe('multiply by', () => {
      it('multiplies by other numbers', () => {
        expect(value.multiplyBy({}, createNumericValue(4))).to.satisfy(numericValue(36));
      });

      it('throws when multiplying by anything else', () => {
        expect(() => value.multiplyBy({}, createStringValue('4'))).to.throw('Cannot treat STRING as NUMBER');
      });
    });

    describe('divide by', () => {
      it('divides by other numbers', () => {
        expect(value.divideBy({}, createNumericValue(3))).to.satisfy(numericValue(3));
      });

      it('even floats', () => {
        expect(value.divideBy({}, createNumericValue(2))).to.satisfy(numericValue(4.5));
      });

      it('throws when dividing by 0', () => {
        expect(() => value.divideBy({}, createNumericValue(0))).to.throw('Divide by zero');
      });

      it('throws when dividing by anything else', () => {
        expect(() => value.divideBy({}, createStringValue('2'))).to.throw('Cannot treat STRING as NUMBER');
      });
    });

    describe('modulo', () => {
      it('modulos other numbers', () => {
        expect(value.modulo({}, createNumericValue(4))).to.satisfy(numericValue(1));
      });

      it('throws when modulo-ing 0', () => {
        expect(() => value.divideBy({}, createNumericValue(0))).to.throw('Divide by zero');
      });

      it('throws when modulo-ing anything else', () => {
        expect(() => value.divideBy({}, createStringValue('4'))).to.throw('Cannot treat STRING as NUMBER');
      });
    });

    describe('less than', () => {
      it('compares larger values', () => {
        expect(value.lessThan({}, createNumericValue(100))).to.be.true;
      });

      it('compares equal values', () => {
        expect(value.lessThan({}, createNumericValue(9))).to.be.false;
      });

      it('compares smaller values', () => {
        expect(value.lessThan({}, createNumericValue(1))).to.be.false;
      });

      it('throws when comparing anything else', () => {
        expect(() => value.lessThan({}, createStringValue('100'))).to.throw('Cannot treat STRING as NUMBER');
      });
    });

    describe('greater than', () => {
      it('compares larger values', () => {
        expect(value.greaterThan({}, createNumericValue(100))).to.be.false;
      });

      it('compares equal values', () => {
        expect(value.greaterThan({}, createNumericValue(9))).to.be.false;
      });

      it('compares smaller values', () => {
        expect(value.greaterThan({}, createNumericValue(1))).to.be.true;
      });

      it('throws when comparing anything else', () => {
        expect(() => value.greaterThan({}, createStringValue('100'))).to.throw('Cannot treat STRING as NUMBER');
      });
    });

    describe('less than or equal', () => {
      it('compares larger values', () => {
        expect(value.lessThanOrEquals({}, createNumericValue(100))).to.be.true;
      });

      it('compares equal values', () => {
        expect(value.lessThanOrEquals({}, createNumericValue(9))).to.be.true;
      });

      it('compares smaller values', () => {
        expect(value.lessThanOrEquals({}, createNumericValue(1))).to.be.false;
      });

      it('throws when comparing anything else', () => {
        expect(() => value.lessThanOrEquals({}, createStringValue('100'))).to.throw('Cannot treat STRING as NUMBER');
      });
    });

    describe('greater than or equal', () => {
      it('compares larger values', () => {
        expect(value.greaterThanOrEquals({}, createNumericValue(100))).to.be.false;
      });

      it('compares equal values', () => {
        expect(value.greaterThanOrEquals({}, createNumericValue(9))).to.be.true;
      });

      it('compares smaller values', () => {
        expect(value.greaterThanOrEquals({}, createNumericValue(1))).to.be.true;
      });

      it('throws when comparing anything else', () => {
        expect(() => value.greaterThanOrEquals({}, createStringValue('100'))).to.throw('Cannot treat STRING as NUMBER');
      });
    });
  });

  describe('zero', () => {
    beforeEach(() => {
      value = createNumericValue(0);
    });

    it('has type NUMBER', () => {
      expect(value.type).to.equal(valueTypes.NUMBER);
    });

    it('has numeric value 0', () => {
      expect(value.asNativeNumber()).to.equal(0);
    });

    it('has string value "0"', () => {
      expect(value.asNativeString()).to.equal('0');
    });

    it('has boolean value false', () => {
      expect(value.asNativeBoolean()).to.be.false;
    });
  });
});
