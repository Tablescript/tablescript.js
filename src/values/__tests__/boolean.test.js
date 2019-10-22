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
      expect(value.type).toEqual(valueTypes.BOOLEAN);
    });

    it('has a native value of true', () => {
      expect(value.asNativeValue()).toEqual(true);
    });

    it('is identical to true', () => {
      expect(value.identicalTo(createBooleanValue(true))).toBeTruthy();
    });

    it('is not identical to false', () => {
      expect(value.identicalTo(createBooleanValue(false))).toBeFalsy();
    });
    
    it('is not identical to a string', () => {
      expect(value.identicalTo(createStringValue('nope'))).toBeFalsy();
    });

    it('cannot convert implicitly to number', () => {
      expect(() => value.asNativeNumber()).toThrow('Cannot treat BOOLEAN as NUMBER');
    });

    it('has a string value of "true"', () => {
      expect(value.asNativeString()).toEqual('true');
    });

    it('has a native boolean value of true', () => {
      expect(value.asNativeBoolean()).toBeTruthy();
    });

    it('cannot convert implicitly to an array', () => {
      expect(() => value.asNativeArray()).toThrow('Cannot treat BOOLEAN as ARRAY');
    });

    it('cannot convert implicitly to an object', () => {
      expect(() => value.asNativeObject()).toThrow('Cannot treat BOOLEAN as OBJECT');
    });

    describe('equivalency', () => {
      it('equals another value that is also true', () => {
        expect(value.nativeEquals(createBooleanValue(true))).toBeTruthy();
      });

      it('does not equal another value that is not true', () => {
        expect(value.nativeEquals(createBooleanValue(false))).toBeFalsy();
      });
    });

    it('cannot convert implicitly to an array', () => {
      expect(() => value.asArray()).toThrow('Cannot treat BOOLEAN as ARRAY');
    });

    it('cannot convert implicitly to an object', () => {
      expect(() => value.asObject()).toThrow('Cannot treat BOOLEAN as OBJECT');
    });

    it('throws when asked for a property', () => {
      expect(() => value.getProperty({}, createStringValue('anything'))).toThrow('Cannot get property of BOOLEAN');
    });

    it('throws when told to set a property', () => {
      expect(() => value.setProperty({}, 'anything', 'anything')).toThrow('Cannot set property of BOOLEAN');
    });

    it('throws when asked for an element', () => {
      expect(() => value.getElement({}, 9)).toThrow('Cannot get element of BOOLEAN');
    });

    it('throws when called', () => {
      expect(() => value.callFunction()).toThrow('BOOLEAN is not callable');
    });

    it('cannot be added to', () => {
      expect(() => value.add({}, createNumericValue(9))).toThrow('Cannot add to BOOLEAN');
    });

    it('cannot be subtracted from', () => {
      expect(() => value.subtract({}, createNumericValue(9))).toThrow('Cannot subtract from BOOLEAN');
    });

    it('cannot be multiplied', () => {
      expect(() => value.multiplyBy({}, createNumericValue(9))).toThrow('Cannot multiply BOOLEAN');
    });

    it('cannot by divided', () => {
      expect(() => value.divideBy({}, createNumericValue(9))).toThrow('Cannot divide BOOLEAN');
    });

    it('cannot modulo', () => {
      expect(() => value.modulo({}, createNumericValue(9))).toThrow('Cannot modulo BOOLEAN');
    });

    it('is not less than anything', () => {
      expect(() => value.lessThan({}, createNumericValue(9))).toThrow('Cannot compare (<) with BOOLEAN');
    });

    it('is not greater than anything', () => {
      expect(() => value.greaterThan({}, createNumericValue(9))).toThrow('Cannot compare (>) with BOOLEAN');
    });

    it('is not less than or equal to anything', () => {
      expect(() => value.lessThanOrEquals({}, createNumericValue(9))).toThrow('Cannot compare (<=) with BOOLEAN');
    });

    it('is not greater than or greater than anything', () => {
      expect(() => value.greaterThanOrEquals({}, createNumericValue(9))).toThrow('Cannot compare (>=) with BOOLEAN');
    });
  });

  describe('when false', () => {
    let value;

    beforeEach(() => {
      value = createBooleanValue(false);
    });

    it('is of type BOOLEAN', () => {
      expect(value.type).toEqual(valueTypes.BOOLEAN);
    });

    it('has a native value of false', () => {
      expect(value.asNativeValue()).toEqual(false);
    });

    it('is identical to false', () => {
      expect(value.identicalTo(createBooleanValue(false))).toBeTruthy();
    });

    it('is not identical to true', () => {
      expect(value.identicalTo(createBooleanValue(true))).toBeFalsy();
    });
    
    it('is not identical to a string', () => {
      expect(value.identicalTo(createStringValue('nope'))).toBeFalsy();
    });

    it('cannot convert implicitly to number', () => {
      expect(() => value.asNativeNumber()).toThrow('Cannot treat BOOLEAN as NUMBER');
    });

    it('has a string value of "false"', () => {
      expect(value.asNativeString()).toEqual('false');
    });

    it('has a native boolean value of false', () => {
      expect(value.asNativeBoolean()).toBeFalsy();
    });

    it('cannot convert implicitly to an array', () => {
      expect(() => value.asNativeArray()).toThrow('Cannot treat BOOLEAN as ARRAY');
    });

    it('cannot convert implicitly to an object', () => {
      expect(() => value.asNativeObject()).toThrow('Cannot treat BOOLEAN as OBJECT');
    });

    describe('equivalency', () => {
      it('equals another value that is also false', () => {
        expect(value.nativeEquals(createBooleanValue(false))).toBeTruthy();
      });

      it('does not equal another value that is not false', () => {
        expect(value.nativeEquals(createBooleanValue(true))).toBeFalsy();
      });
    });

    it('cannot convert implicitly to an array', () => {
      expect(() => value.asArray()).toThrow('Cannot treat BOOLEAN as ARRAY');
    });

    it('cannot convert implicitly to an object', () => {
      expect(() => value.asObject()).toThrow('Cannot treat BOOLEAN as OBJECT');
    });

    it('throws when asked for a property', () => {
      expect(() => value.getProperty({}, createStringValue('anything'))).toThrow('Cannot get property of BOOLEAN');
    });

    it('throws when told to set a property', () => {
      expect(() => value.setProperty({}, 'anything', 'anything')).toThrow('Cannot set property of BOOLEAN');
    });

    it('throws when asked for an element', () => {
      expect(() => value.getElement({}, 9)).toThrow('Cannot get element of BOOLEAN');
    });

    it('throws when called', () => {
      expect(() => value.callFunction()).toThrow('BOOLEAN is not callable');
    });

    it('cannot be added to', () => {
      expect(() => value.add({}, createNumericValue(9))).toThrow('Cannot add to BOOLEAN');
    });

    it('cannot be subtracted from', () => {
      expect(() => value.subtract({}, createNumericValue(9))).toThrow('Cannot subtract from BOOLEAN');
    });

    it('cannot be multiplied', () => {
      expect(() => value.multiplyBy({}, createNumericValue(9))).toThrow('Cannot multiply BOOLEAN');
    });

    it('cannot by divided', () => {
      expect(() => value.divideBy({}, createNumericValue(9))).toThrow('Cannot divide BOOLEAN');
    });

    it('cannot modulo', () => {
      expect(() => value.modulo({}, createNumericValue(9))).toThrow('Cannot modulo BOOLEAN');
    });

    it('is not less than anything', () => {
      expect(() => value.lessThan({}, createNumericValue(9))).toThrow('Cannot compare (<) with BOOLEAN');
    });

    it('is not greater than anything', () => {
      expect(() => value.greaterThan({}, createNumericValue(9))).toThrow('Cannot compare (>) with BOOLEAN');
    });

    it('is not less than or equal to anything', () => {
      expect(() => value.lessThanOrEquals({}, createNumericValue(9))).toThrow('Cannot compare (<=) with BOOLEAN');
    });

    it('is not greater than or greater than anything', () => {
      expect(() => value.greaterThanOrEquals({}, createNumericValue(9))).toThrow('Cannot compare (>=) with BOOLEAN');
    });
  });
});
