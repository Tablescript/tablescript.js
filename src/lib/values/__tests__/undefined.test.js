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

import { createUndefined } from '../undefined';
import '../../__tests__/matchers';

describe('createUndefined', () => {
  let value;

  beforeEach(() => {
    value = createUndefined();
  });

  describe('native', () => {
    it('has a native value of undefined', () => {
      expect(value.asNativeValue()).toEqual(undefined);
    });

    it('has type UNDEFINED', () => {
      expect(value).toBeTsUndefined();
    });

    it('throws when converted to number', () => {
      expect(() => value.asNativeNumber()).toThrow('Cannot treat UNDEFINED as NUMBER');
    });

    it('has string value undefined', () => {
      expect(value.asNativeString()).toEqual('undefined');
    });

    it('is false', () => {
      expect(value.asNativeBoolean()).toEqual(false);
    });

    describe('equality', () => {
      it('is equal to another undefined', () => {
        expect(value.nativeEquals(createUndefined())).toBeTruthy();
      });

      it('is not equal to anything else', () => {
        expect(value.nativeEquals({ type: 'anything else' })).toBeFalsy();
      });
    });
  });

  it('throws when asked for a property', () => {
    expect(() => value.getProperty()).toThrow('Cannot get property of UNDEFINED');
  });

  it('throws when asked to set property', () => {
    expect(() => value.setProperty()).toThrow('Cannot set property of UNDEFINED');
  });

  it('throws when asked for an element', () => {
    expect(() => value.getElement()).toThrow('Cannot get element of UNDEFINED');
  });

  it('throws when called', () => {
    expect(() => value.callFunction()).toThrow('UNDEFINED is not callable');
  });
});
