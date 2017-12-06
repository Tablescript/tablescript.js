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

import { createBooleanValue } from '../../src/values/boolean';
import { createStringValue } from '../../src/values/string';
import { valueTypes } from '../../src/values/types';

describe('boolean', () => {
  describe('when true', () => {
    let value;

    beforeEach(() => {
      value = createBooleanValue(true);
    });

    it('is of type BOOLEAN', () => {
      expect(value.type).to.equal(valueTypes.BOOLEAN);
    });

    it('has a numeric value of 1', () => {
      expect(value.asNativeNumber()).to.equal(1);
    });

    it('has a string value of "true"', () => {
      expect(value.asNativeString()).to.equal('true');
    });

    describe('equivalency', () => {
      it('equals another value that is also true', () => {
        expect(value.equals({}, createBooleanValue(true))).to.be.true;
      });

      it('does not equal another value that is not true', () => {
        expect(value.equals({}, createBooleanValue(false))).to.be.false;
      });
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
  });

  describe('when false', () => {
    let value;

    beforeEach(() => {
      value = createBooleanValue(false);
    });

    it('is of type BOOLEAN', () => {
      expect(value.type).to.equal(valueTypes.BOOLEAN);
    });

    it('has a numeric value of 0', () => {
      expect(value.asNativeNumber()).to.equal(0);
    });

    it('has a string value of "false"', () => {
      expect(value.asNativeString()).to.equal('false');
    });

    describe('equivalency', () => {
      it('equals another value that is also false', () => {
        expect(value.equals({}, createBooleanValue(false))).to.be.true;
      });

      it('does not equal another value that is not false', () => {
        expect(value.equals({}, createBooleanValue(true))).to.be.false;
      });
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
  });
});
