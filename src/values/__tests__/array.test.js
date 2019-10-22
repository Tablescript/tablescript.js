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

import { createStringValue } from '../string';
import { createNumericValue } from '../numeric';
import { createBooleanValue } from '../boolean';
import { createArrayValue } from '../array';
import defaultFactory from '../../__tests__/factory';
require('../../__tests__/matchers');

const nonEmptyArray = () => createArrayValue([createStringValue('I have a ham radio'), createNumericValue(12), createBooleanValue(false)]);
const emptyArray = () => createArrayValue([]);

describe('array', () => {

  describe('with an initial value', () => {
    let value;
    let mockContext;

    beforeEach(() => {
      value = nonEmptyArray();
      mockContext = {
        ...defaultFactory,
      }
    });

    it('has an ARRAY type', () => {
      expect(value).toBeTsArray();
    });

    it('throws if cast as a number', () => {
      expect(() => value.asNativeNumber()).toThrow('Cannot treat ARRAY as NUMBER');
    });

    it('has a JSON-ish string representation', () => {
      expect(value.asNativeString()).toEqual('["I have a ham radio",12,false]');
    });

    it('is true', () => {
      expect(value.asNativeBoolean()).toEqual(true);
    });

    it('has a native array representation', () => {
      expect(value.asNativeArray()).toStrictEqual(['I have a ham radio', 12, false]);
    });

    describe('equality', () => {
      it('is equal to the same non-empty array', () => {
        expect(value.nativeEquals(nonEmptyArray())).toBeTruthy();
      });
    });

    describe('properties', () => {
      it('returns undefined for non-method properties', () => {
        expect(value.getProperty(mockContext, createStringValue('not there'))).toBeTsUndefined();
      });

      describe('set', () => {

      });
    });

    describe('elements', () => {
      describe('get', () => {
        it('returns the first element', () => {
          expect(value.getElement(mockContext, createNumericValue(0))).toEqualTsString('I have a ham radio');
        });

        it('returns the second element', () => {
          expect(value.getElement(mockContext, createNumericValue(1))).toEqualTsNumber(12);
        });

        it('returns the last element', () => {
          expect(value.getElement(mockContext, createNumericValue(2))).toEqualTsBoolean(false);
        });

        it('returns the last element when index is -1', () => {
          expect(value.getElement(mockContext, createNumericValue(-1))).toEqualTsBoolean(false);
        });

        it('returns undefined for an index too high', () => {
          expect(value.getElement(mockContext, createNumericValue(200))).toBeTsUndefined();
        });

        it('returns undefined for an index too low', () => {
          expect(value.getElement(mockContext, createNumericValue(-200))).toBeTsUndefined();
        });
      });
    });
  });

  describe('empty', () => {
  });
});
