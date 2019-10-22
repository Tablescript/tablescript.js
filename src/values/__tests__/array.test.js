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
import { createStringValue } from '../string';
import { createNumericValue } from '../numeric';
import { createBooleanValue } from '../boolean';
import { createUndefined } from '../undefined';
import { createArrayValue } from '../array';
import { TablescriptError } from '../../error';
import { undefinedValue } from '../../__tests__/util';

const nonEmptyArray = () => createArrayValue([createStringValue('I have a ham radio'), createNumericValue(12), createBooleanValue(false)]);
const emptyArray = () => createArrayValue([]);

xdescribe('array', () => {

  describe('with an initial value', () => {
    let value;

    beforeEach(() => {
      value = nonEmptyArray();
    });

    it('has an ARRAY type', () => {
      expect(value.type).to.equal(valueTypes.ARRAY);
    });

    it('throws if cast as a number', () => {
      expect(() => value.asNativeNumber()).to.throw('Cannot cast ARRAY to number');
    });

    it('has a JSON-ish string representation', () => {
      expect(value.asNativeString()).to.equal('["I have a ham radio",12,false]');
    });

    it('is true', () => {
      expect(value.asNativeBoolean()).to.be.true;
    });

    it('has a native array representation', () => {
      expect(value.asNativeArray()).to.eql(['I have a ham radio', 12, false]);
    });

    describe('equality', () => {
      it('is equal to the same non-empty array', () => {
        expect(value.nativeEquals(nonEmptyArray())).to.be.true;
      });
    });

    describe('properties', () => {
      it('returns undefined for non-method properties', () => {
        expect(value.getProperty({}, createStringValue('not there')).type).to.equal(valueTypes.UNDEFINED);
      });

      describe('set', () => {

      });
    });
  });

  describe('empty', () => {
  });
});
