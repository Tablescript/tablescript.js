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
import { createStringValue } from '../string';
import { valueTypes } from '../types';

describe('numeric value', () => {
  let value;

  describe('non-zero', () => {
    beforeEach(() => {
      value = createNumericValue(1);
    });

    it('has type NUMBER', () => {
      expect(value.type).to.equal(valueTypes.NUMBER);
    });

    it('has its own value', () => {
      expect(value.asNativeNumber()).to.equal(1);
    });

    it('has its own value in a string', () => {
      expect(value.asNativeString()).to.equal('1');
    });

    it('is true', () => {
      expect(value.asNativeBoolean()).to.be.true;
    });

    describe('equivalency', () => {
      it('is equal to its own value', () => {
        expect(value.nativeEquals({}, createNumericValue(1))).to.be.true;
      });

      it('is not equal to a different value', () => {
        expect(value.nativeEquals({}, createNumericValue(99))).to.be.false;
      });
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
