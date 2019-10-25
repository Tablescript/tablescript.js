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
import { createStringValue } from '../string';
import { createNumericValue } from '../numeric';
import { valueTypes } from '../types';
import { initializeContext } from '../../context';
import defaultValueFactory from '../../value-factory';
import '../../__tests__/matchers';

describe('string value', () => {
  let mockContext;
  let value;

  beforeEach(() => {
    mockContext = initializeContext({}, {}, defaultValueFactory);
  });

  describe('containing a non-empty string', () => {
    beforeEach(() => {
      value = createStringValue('I have a ham radio');
    });

    it('has type STRING', () => {
      expect(value).toBeTsString();
    });

    it('cannot be implicitly converted to number', () => {
      expect(() => value.asNativeNumber()).toThrow('Cannot treat STRING as NUMBER');
    });

    it('has a string value of itself', () => {
      expect(value.asNativeString()).toEqual('I have a ham radio');
    });

    it('has a boolean value of true', () => {
      expect(value.asNativeBoolean()).toEqual(true);
    });

    describe('equivalency', () => {
      it('is equal to the same string', () => {
        expect(value.nativeEquals(createStringValue('I have a ham radio'))).toBeTruthy();
      });

      it('is not equal to a different string', () => {
        expect(value.nativeEquals(createStringValue('I do not have a ham radio'))).toBeFalsy();
      });
    });

    it('throws when asked to set a property', () => {
      expect(() => value.setProperty(mockContext, 'anything', 'anything')).toThrow('Cannot set property of STRING');
    });

    describe('elements', () => {
      it('gets indexed elements as strings', () => {
        const element = value.getElement(mockContext, createNumericValue(0));
        expect(element).toEqualTsString('I');
      });

      it('gets reverse-indexed elements as strings', () => {
        const element = value.getElement(mockContext, createNumericValue(-2));
        expect(element).toEqualTsString('i');
      });

      it('returns undefined when asked for elements outside the string', () => {
        expect(value.getElement(mockContext, createNumericValue(100))).toBeTsUndefined();
      });
    });

    it('throws when called', () => {
      expect(() => value.callFunction()).toThrow('STRING is not callable');
    });
  });

  describe('containing an empty string', () => {
    beforeEach(() => {
      value = createStringValue('');
    });

    it('has type STRING', () => {
      expect(value).toBeTsString();;
    });

    it('cannot be implicitly converted to number', () => {
      expect(() => value.asNativeNumber()).toThrow('Cannot treat STRING as NUMBER');
    });

    it('has a string value of itself', () => {
      expect(value.asNativeString()).toEqual('');
    });

    it('has a boolean value of false', () => {
      expect(value.asNativeBoolean()).toEqual(false);
    });

    describe('equivalency', () => {
      it('is equal to the same string', () => {
        expect(value.nativeEquals(createStringValue(''))).toBeTruthy();
      });

      it('is not equal to a different string', () => {
        expect(value.nativeEquals(createStringValue('I do not have a ham radio'))).toBeFalsy();
      });
    });

    it('throws when asked to set a property', () => {
      expect(() => value.setProperty(mockContext, 'anything', 'anything')).toThrow('Cannot set property of STRING');
    });

    describe('elements', () => {
      it('returns undefined when asked for elements outside the string', () => {
        expect(value.getElement(mockContext, createNumericValue(100)).type).toEqual(valueTypes.UNDEFINED);
      });
    });

    it('throws when called', () => {
      expect(() => value.callFunction()).toThrow('STRING is not callable');
    });
  });

  it('cannot implicitly convert to number', () => {
    const value = createStringValue('123');
    expect(() => value.asNativeNumber()).toThrow('Cannot treat STRING as NUMBER');
  });
});
