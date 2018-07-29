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

import { createBooleanValue } from '../boolean';
import { createNumericValue } from '../numeric';
import { createStringValue } from '../string';
import { valueTypes } from '../types';

describe('boolean', () => {
  describe('when true', () => {
    let value;

    beforeEach(() => {
      value = createBooleanValue(true);
    });

    it('is of type BOOLEAN', () => {
      expect(value.type).to.equal(valueTypes.BOOLEAN);
    });

    it('has a native value of true', () => {
      expect(value.asNativeValue()).to.equal(true);
    });

    it('is identical to true', () => {
      expect(value.identicalTo({}, createBooleanValue(true))).to.be.true;
    });

    it('is not identical to false', () => {
      expect(value.identicalTo({}, createBooleanValue(false))).to.be.false;
    });
    
    it('is not identical to a string', () => {
      expect(value.identicalTo({}, createStringValue('nope'))).to.be.false;
    });

    it('cannot convert implicitly to number', () => {
      expect(() => value.asNativeNumber()).to.throw('Cannot treat BOOLEAN as NUMBER');
    });

    it('has a string value of "true"', () => {
      expect(value.asNativeString()).to.equal('true');
    });

    it('has a native boolean value of true', () => {
      expect(value.asNativeBoolean()).to.be.true;
    });

    it('cannot convert implicitly to an array', () => {
      expect(() => value.asNativeArray()).to.throw('Cannot treat BOOLEAN as ARRAY');
    });

    it('cannot convert implicitly to an object', () => {
      expect(() => value.asNativeObject()).to.throw('Cannot treat BOOLEAN as OBJECT');
    });

    describe('equivalency', () => {
      it('equals another value that is also true', () => {
        expect(value.nativeEquals({}, createBooleanValue(true))).to.be.true;
      });

      it('does not equal another value that is not true', () => {
        expect(value.nativeEquals({}, createBooleanValue(false))).to.be.false;
      });
    });

    it('cannot convert implicitly to an array', () => {
      expect(() => value.asArray()).to.throw('Cannot treat BOOLEAN as ARRAY');
    });

    it('cannot convert implicitly to an object', () => {
      expect(() => value.asObject()).to.throw('Cannot treat BOOLEAN as OBJECT');
    });

    it('throws when asked for a property', () => {
      expect(() => value.getProperty({}, createStringValue('anything'))).to.throw('Cannot get property of BOOLEAN');
    });

    it('throws when told to set a property', () => {
      expect(() => value.setProperty({}, 'anything', 'anything')).to.throw('Cannot set property of BOOLEAN');
    });

    it('throws when asked for an element', () => {
      expect(() => value.getElement({}, 9)).to.throw('Cannot get element of BOOLEAN');
    });

    it('throws when called', () => {
      expect(() => value.callFunction()).to.throw('BOOLEAN is not callable');
    });

    it('cannot be added to', () => {
      expect(() => value.add({}, createNumericValue(9))).to.throw('Cannot add to BOOLEAN');
    });

    it('cannot be subtracted from', () => {
      expect(() => value.subtract({}, createNumericValue(9))).to.throw('Cannot subtract from BOOLEAN');
    });

    it('cannot be multiplied', () => {
      expect(() => value.multiplyBy({}, createNumericValue(9))).to.throw('Cannot multiply BOOLEAN');
    });

    it('cannot by divided', () => {
      expect(() => value.divideBy({}, createNumericValue(9))).to.throw('Cannot divide BOOLEAN');
    });

    it('cannot modulo', () => {
      expect(() => value.modulo({}, createNumericValue(9))).to.throw('Cannot modulo BOOLEAN');
    });

    it('is not less than anything', () => {
      expect(() => value.lessThan({}, createNumericValue(9))).to.throw('Cannot compare (<) with BOOLEAN');
    });

    it('is not greater than anything', () => {
      expect(() => value.greaterThan({}, createNumericValue(9))).to.throw('Cannot compare (>) with BOOLEAN');
    });

    it('is not less than or equal to anything', () => {
      expect(() => value.lessThanOrEquals({}, createNumericValue(9))).to.throw('Cannot compare (<=) with BOOLEAN');
    });

    it('is not greater than or greater than anything', () => {
      expect(() => value.greaterThanOrEquals({}, createNumericValue(9))).to.throw('Cannot compare (>=) with BOOLEAN');
    });
  });

  describe('when false', () => {
    let value;

    beforeEach(() => {
      value = createBooleanValue(false);
    });

    it('is of type BOOLEAN', () => {
      expect(value.type).to.equal(valueTypes.BOOLEAN);
    });

    it('has a native value of false', () => {
      expect(value.asNativeValue()).to.equal(false);
    });

    it('is identical to false', () => {
      expect(value.identicalTo({}, createBooleanValue(false))).to.be.true;
    });

    it('is not identical to true', () => {
      expect(value.identicalTo({}, createBooleanValue(true))).to.be.false;
    });
    
    it('is not identical to a string', () => {
      expect(value.identicalTo({}, createStringValue('nope'))).to.be.false;
    });

    it('cannot convert implicitly to number', () => {
      expect(() => value.asNativeNumber()).to.throw('Cannot treat BOOLEAN as NUMBER');
    });

    it('has a string value of "false"', () => {
      expect(value.asNativeString()).to.equal('false');
    });

    it('has a native boolean value of false', () => {
      expect(value.asNativeBoolean()).to.be.false;
    });

    it('cannot convert implicitly to an array', () => {
      expect(() => value.asNativeArray()).to.throw('Cannot treat BOOLEAN as ARRAY');
    });

    it('cannot convert implicitly to an object', () => {
      expect(() => value.asNativeObject()).to.throw('Cannot treat BOOLEAN as OBJECT');
    });

    describe('equivalency', () => {
      it('equals another value that is also false', () => {
        expect(value.nativeEquals({}, createBooleanValue(false))).to.be.true;
      });

      it('does not equal another value that is not false', () => {
        expect(value.nativeEquals({}, createBooleanValue(true))).to.be.false;
      });
    });

    it('cannot convert implicitly to an array', () => {
      expect(() => value.asArray()).to.throw('Cannot treat BOOLEAN as ARRAY');
    });

    it('cannot convert implicitly to an object', () => {
      expect(() => value.asObject()).to.throw('Cannot treat BOOLEAN as OBJECT');
    });

    it('throws when asked for a property', () => {
      expect(() => value.getProperty({}, createStringValue('anything'))).to.throw('Cannot get property of BOOLEAN');
    });

    it('throws when told to set a property', () => {
      expect(() => value.setProperty({}, 'anything', 'anything')).to.throw('Cannot set property of BOOLEAN');
    });

    it('throws when asked for an element', () => {
      expect(() => value.getElement({}, 9)).to.throw('Cannot get element of BOOLEAN');
    });

    it('throws when called', () => {
      expect(() => value.callFunction()).to.throw('BOOLEAN is not callable');
    });

    it('cannot be added to', () => {
      expect(() => value.add({}, createNumericValue(9))).to.throw('Cannot add to BOOLEAN');
    });

    it('cannot be subtracted from', () => {
      expect(() => value.subtract({}, createNumericValue(9))).to.throw('Cannot subtract from BOOLEAN');
    });

    it('cannot be multiplied', () => {
      expect(() => value.multiplyBy({}, createNumericValue(9))).to.throw('Cannot multiply BOOLEAN');
    });

    it('cannot by divided', () => {
      expect(() => value.divideBy({}, createNumericValue(9))).to.throw('Cannot divide BOOLEAN');
    });

    it('cannot modulo', () => {
      expect(() => value.modulo({}, createNumericValue(9))).to.throw('Cannot modulo BOOLEAN');
    });

    it('is not less than anything', () => {
      expect(() => value.lessThan({}, createNumericValue(9))).to.throw('Cannot compare (<) with BOOLEAN');
    });

    it('is not greater than anything', () => {
      expect(() => value.greaterThan({}, createNumericValue(9))).to.throw('Cannot compare (>) with BOOLEAN');
    });

    it('is not less than or equal to anything', () => {
      expect(() => value.lessThanOrEquals({}, createNumericValue(9))).to.throw('Cannot compare (<=) with BOOLEAN');
    });

    it('is not greater than or greater than anything', () => {
      expect(() => value.greaterThanOrEquals({}, createNumericValue(9))).to.throw('Cannot compare (>=) with BOOLEAN');
    });
  });
});
