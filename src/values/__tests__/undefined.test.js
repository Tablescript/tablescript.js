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

import { valueTypes } from '../types';
import { createUndefined } from '../undefined';

xdescribe('createUndefined', () => {
  let value;

  beforeEach(() => {
    value = createUndefined();
  });

  describe('native', () => {
    it('has a native value of undefined', () => {
      expect(value.asNativeValue()).to.equal(undefined);
    });

    it('has type UNDEFINED', () => {
      expect(value.type).to.equal(valueTypes.UNDEFINED);
    });

    it('throws when converted to number', () => {
      expect(() => value.asNativeNumber()).to.throw('Cannot cast UNDEFINED to number');
    });

    it('has string value undefined', () => {
      expect(value.asNativeString()).to.equal('undefined');
    });

    it('is false', () => {
      expect(value.asNativeBoolean()).to.be.false;
    });

    describe('equality', () => {
      it('is equal to another undefined', () => {
        expect(value.nativeEquals(createUndefined())).to.be.true;
      });

      it('is not equal to anything else', () => {
        expect(value.nativeEquals({ type: 'anything else' })).to.be.false;
      });
    });
  });

  describe('non-native', () => {
    it('throws when converted to number', () => {
      expect(() => value.asNumber()).to.throw('Cannot cast UNDEFINED to number');
    });

    describe('as string', () => {
      let stringValue;

      beforeEach(() => {
        stringValue = value.asString();
      });

      it('has a string type', () => {
        expect(stringValue.type).to.equal(valueTypes.STRING);
      });

      it('is "undefined"', () => {
        expect(stringValue.asNativeString()).to.equal('undefined');
      });
    });

    describe('as boolean', () => {
      let booleanValue;

      beforeEach(() => {
        booleanValue = value.asBoolean();
      });

      it('has a boolean type', () => {
        expect(booleanValue.type).to.equal(valueTypes.BOOLEAN);
      });

      it('is false', () => {
        expect(booleanValue.asNativeBoolean()).to.be.false;
      });
    });
  });

  it('throws when asked for a property', () => {
    expect(() => value.getProperty()).to.throw('Cannot get property of UNDEFINED');
  });

  it('throws when asked to set property', () => {
    expect(() => value.setProperty()).to.throw('Cannot set property of UNDEFINED');
  });

  it('throws when asked for an element', () => {
    expect(() => value.getElement()).to.throw('Cannot get element of UNDEFINED');
  });

  it('throws when called', () => {
    expect(() => value.callFunction()).to.throw('UNDEFINED is not callable');
  });
});
