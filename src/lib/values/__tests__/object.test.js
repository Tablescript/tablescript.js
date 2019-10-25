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
import { createObjectValue } from '../object';
import { createNumericValue } from '../numeric';
import { createStringValue } from '../string';
import { createArrayValue } from '../array';
import { valueTypes } from '../types';
import { initializeContext } from '../../context';
import defaultValueFactory from '../../value-factory';
import '../../__tests__/matchers';

describe('object value', () => {
  let mockContext;
  let dummyObject;
  let value;

  beforeEach(() => {
    mockContext = initializeContext({}, {}, defaultValueFactory);
  });

  describe('when non-empty', () => {
    beforeEach(() => {
      dummyObject = {
        a: createNumericValue(1),
        b: createStringValue('I have a ham radio'),
        c: createArrayValue([createNumericValue(2), createStringValue('FizzBuzz')]),
      };
      value = createObjectValue(dummyObject);
    });

    it('has type OBJECT', () => {
      expect(value).toBeTsObject();
    });

    it('throws when asked for its numeric value', () => {
      expect(() => value.asNativeNumber()).toThrow('Cannot treat OBJECT as NUMBER');
    });

    it('returns a json-y value when asked for its string value', () => {
      expect(value.asNativeString()).toEqual('{"a":1,"b":"I have a ham radio","c":[2,"FizzBuzz"]}');
    });

    it('is true', () => {
      expect(value.asNativeBoolean()).toEqual(true);
    });

    it('has a native object value', () => {
      expect(value.asNativeObject()).toEqual({
        a: 1,
        b: 'I have a ham radio',
        c: [2, 'FizzBuzz'],
      });
    });

    describe('properties', () => {
      describe('getting', () => {
        it('a is a number', () => {
          const prop = value.getProperty({}, createStringValue('a'));
          expect(prop).toEqualTsNumber(1);
        });

        it('b is a string', () => {
          const prop = value.getProperty({}, createStringValue('b'));
          expect(prop).toEqualTsString('I have a ham radio');
        });

        it('c is an array', () => {
          const prop = value.getProperty({}, createStringValue('c'));
          expect(prop).toEqualTsArray(createArrayValue([createNumericValue(2), createStringValue('FizzBuzz')]));
        });

        it('d is not a property as so is undefined', () => {
          expect(value.getProperty(mockContext, createStringValue('d'))).toBeTsUndefined();
        });
      });

      describe('setting', () => {
        it('sets', () => {
          value.setProperty({}, createStringValue('d'), createNumericValue(99));
          expect(value.getProperty({}, createStringValue('d'))).toEqualTsNumber(99);
        });
      });
    });

    it('throws when asked for an element', () => {
      expect(() => value.getElement()).toThrow('Cannot get element of OBJECT');
    });

    it('throws when called', () => {
      expect(() => value.callFunction()).toThrow('OBJECT is not callable');
    });
  });

  describe('when empty', () => {
    beforeEach(() => {
      dummyObject = {}
      value = createObjectValue(dummyObject);
    });

    it('has type OBJECT', () => {
      expect(value).toBeTsObject();
    });

    it('throws when cast as number', () => {
      expect(() => value.asNativeNumber()).toThrow('Cannot treat OBJECT as NUMBER');
    });

    it('has an empty json-ish string value', () => {
      expect(value.asNativeString()).toEqual('{}');
    });

    it('is true', () => {
      expect(value.asNativeBoolean()).toEqual(true);
    });

    it('is an empty object', () => {
      expect(value.asNativeObject()).toEqual({});
    });

    describe('equality', () => {
      it('is equal to an empty object', () => {
        expect(value.nativeEquals(createObjectValue({}))).toBeTruthy();
      });
    });

    describe('properties', () => {
      describe('getting', () => {
        it('returns undefined for non-existent keys', () => {
          expect(value.getProperty(mockContext, createStringValue('not there'))).toBeTsUndefined();
        });
      });

      describe('setting', () => {
        it('sets', () => {
          value.setProperty({}, createStringValue('newKey'), createNumericValue(99));
          expect(value.getProperty({}, createStringValue('newKey'))).toEqualTsNumber(99);
        });
      });
    });

    it('throws when asked for an element', () => {
      expect(() => value.getElement()).toThrow('Cannot get element of OBJECT');
    });

    it('throws when called', () => {
      expect(() => value.callFunction()).toThrow('OBJECT is not callable');
    });
  });
});
