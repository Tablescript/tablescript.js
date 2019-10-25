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
import { initializeContext } from '../../context';
import defaultValueFactory from '../../value-factory';
import { createArrayValue } from '../array';
import { createStringValue } from '../string';
import { createNumericValue } from '../numeric';
import { createBooleanValue } from '../boolean';
import '../../__tests__/matchers';

const stringMethod = mockContext => (s, method) => createStringValue(s).getProperty(mockContext, createStringValue(method));

const tsStringArray = a => createArrayValue(a.map(createStringValue));

describe('string properties', () => {
  let mockContext;
  let getStringMethod;

  beforeEach(() => {
    mockContext = initializeContext({}, {}, defaultValueFactory);
    getStringMethod = stringMethod(mockContext);
  });

  describe('split', () => {
    describe('with a non-empty delimiter', () => {
      it('splits an empty string into an array with an empty string', () => {
        const split = getStringMethod('', 'split');
        expect(split.callFunction(mockContext, [createStringValue('|')])).toEqualTsArray(tsStringArray(['']));
      });

      it('splits a string into an array strings', () => {
        const split = getStringMethod('john george paul ringo', 'split');
        expect(split.callFunction(mockContext, [createStringValue(' ')]))
          .toEqualTsArray(tsStringArray(['john', 'george', 'paul', 'ringo']));
      });
    });
    
    describe('with an empty delimiter', () => {
      it('splits an empty string into an array of empty string', () => {
        const split = getStringMethod('', 'split');
        expect(split.callFunction(mockContext, [])).toEqualTsArray(tsStringArray(['']));
      });

      it('splits a string into an array of the string', () => {
        const split = getStringMethod('john george paul ringo', 'split');
        expect(split.callFunction(mockContext, [])).toEqualTsArray(tsStringArray(['john george paul ringo']));
      });
    });

    it('throws if the delimiter is not a string', () => {
      const split = getStringMethod('john george paul ringo', 'split');
      expect(() => split.callFunction(mockContext, [createNumericValue(12)])).toThrow('split(separator) separator must be a string');
    });
  });

  describe('capitalize', () => {
    it('returns an empty string', () => {
      const capitalize = getStringMethod('', 'capitalize');
      expect(capitalize.callFunction(mockContext, [])).toEqualTsString('');
    });

    it('capitalizes a single character', () => {
      const capitalize = getStringMethod('a', 'capitalize');
      expect(capitalize.callFunction(mockContext, [])).toEqualTsString('A');
    });

    it('capitalizes a string', () => {
      const capitalize = getStringMethod('abalone', 'capitalize');
      expect(capitalize.callFunction(mockContext, [])).toEqualTsString('Abalone');
    });

    it('leaves an already capitalized string alone', () => {
      const capitalize = getStringMethod('Abalone', 'capitalize');
      expect(capitalize.callFunction(mockContext, [])).toEqualTsString('Abalone');
    });
  });

  describe('uppercase', () => {
    it('returns an empty string', () => {
      const uppercase = getStringMethod('', 'uppercase');
      expect(uppercase.callFunction(mockContext, [])).toEqualTsString('');
    });

    it('returns an uppercase version', () => {
      const uppercase = getStringMethod('abalone', 'uppercase');
      expect(uppercase.callFunction(mockContext, [])).toEqualTsString('ABALONE');
    });
  });

  describe('lowercase', () => {
    it('returns an empty string', () => {
      const lowercase = getStringMethod('', 'lowercase');
      expect(lowercase.callFunction(mockContext, [])).toEqualTsString('');
    });

    it('returns an lowercase version', () => {
      const lowercase = getStringMethod('AbaLone', 'lowercase');
      expect(lowercase.callFunction(mockContext, [])).toEqualTsString('abalone');
    });
  });

  describe('includes', () => {
    it('returns false for an empty string', () => {
      const includes = getStringMethod('', 'includes');
      expect(includes.callFunction(mockContext, [createStringValue('not gonna find it')])).toEqualTsBoolean(false);
    });

    it('returns false when no match found', () => {
      const includes = getStringMethod('I have a ham radio', 'includes');
      expect(includes.callFunction(mockContext, [createStringValue('flung')])).toEqualTsBoolean(false);
    });

    it('returns true when a match is found', () => {
      const includes = getStringMethod('I have a ham radio', 'includes');
      expect(includes.callFunction(mockContext, [createStringValue('ham')])).toEqualTsBoolean(true);
    });

    it('throws when passed a non-string', () => {
      const includes = getStringMethod('I have a ham radio', 'includes');
      expect(() => includes.callFunction(mockContext, [createBooleanValue(true)])).toThrow('includes(s) s must be a string');
    })
  });

  describe('indexOf', () => {
    it('returns -1 for an empty string', () => {
      const indexOf = getStringMethod('', 'indexOf');
      expect(indexOf.callFunction(mockContext, [createStringValue('not gonna find it')])).toEqualTsNumber(-1);
    });

    it('returns -1 when no match found', () => {
      const indexOf = getStringMethod('I have a ham radio', 'indexOf');
      expect(indexOf.callFunction(mockContext, [createStringValue('not gonna find it')])).toEqualTsNumber(-1);
    });

    it('returns the index of the match', () => {
      const indexOf = getStringMethod('I have a ham radio', 'indexOf');
      expect(indexOf.callFunction(mockContext, [createStringValue('ham')])).toEqualTsNumber(9);
    });

    it('returns the index of the first match', () => {
      const indexOf = getStringMethod('I have a ham radio', 'indexOf');
      expect(indexOf.callFunction(mockContext, [createStringValue('ha')])).toEqualTsNumber(2);
    });

    it('throws when passed a non-string', () => {
      const indexOf = getStringMethod('I have a ham radio', 'indexOf');
      expect(() => indexOf.callFunction(mockContext, [createBooleanValue(true)])).toThrow('indexOf(s) s must be a string');
    });
  });

  describe('slice', () => {
    it('returns an empty string for an empty string with a start index', () => {
      const slice = getStringMethod('', 'slice');
      expect(slice.callFunction(mockContext, [createNumericValue(100)])).toEqualTsString('');
    });

    it('returns an empty string for an empty string with start and end indices', () => {
      const slice = getStringMethod('', 'slice');
      expect(slice.callFunction(mockContext, [createNumericValue(100), createNumericValue(200)])).toEqualTsString('');
    });

    it('returns the remainder of a string when passed only a start index', () => {
      const slice = getStringMethod('I have a ham radio', 'slice');
      expect(slice.callFunction(mockContext, [createNumericValue(7)])).toEqualTsString('a ham radio');
    });

    it('returns a substring when passed both start and end indices', () => {
      const slice = getStringMethod('I have a ham radio', 'slice');
      expect(slice.callFunction(mockContext, [createNumericValue(7), createNumericValue(12)])).toEqualTsString('a ham');
    });

    it('throws when start is not passed', () => {
      const slice = getStringMethod('I have a ham radio', 'slice');
      expect(() => slice.callFunction(mockContext, [])).toThrow('slice(start,end) missing required parameter "start"');
    });

    it('throws when start is not a number', () => {
      const slice = getStringMethod('I have a ham radio', 'slice');
      expect(
        () => slice.callFunction(mockContext, [createStringValue('not gonna work')])
      ).toThrow('slice(start,end) start must be a number');
    });

    it('throws when end is passed but is not a number', () => {
      const slice = getStringMethod('I have a ham radio', 'slice');
      expect(
        () => slice.callFunction(mockContext, [createNumericValue(3), createStringValue('not gonna work')])
      ).toThrow('slice(start,end) end must be a number');
    });
  });

  describe('startsWith', () => {
    it('returns true for an empty string starting with an empty string', () => {
      const startsWith = getStringMethod('', 'startsWith');
      expect(startsWith.callFunction(mockContext, [createStringValue('')])).toEqualTsBoolean(true);
    });

    it('returns true for a non-empty string starting with an empty string', () => {
      const startsWith = getStringMethod('abalone', 'startsWith');
      expect(startsWith.callFunction(mockContext, [createStringValue('')])).toEqualTsBoolean(true);
    });

    it('returns true if a non-empty string starts with a non-empty string', () => {
      const startsWith = getStringMethod('abalone', 'startsWith');
      expect(startsWith.callFunction(mockContext, [createStringValue('abalo')])).toEqualTsBoolean(true);
    });

    it('returns false if a non-empty string does not start with a non-empty string', () => {
      const startsWith = getStringMethod('abalone', 'startsWith');
      expect(startsWith.callFunction(mockContext, [createStringValue('nope')])).toEqualTsBoolean(false);
    });

    it('throws if passed a non-string', () => {
      const startsWith = getStringMethod('abalone', 'startsWith');
      expect(() => startsWith.callFunction(mockContext, [createBooleanValue(true)])).toThrow('startsWith(s) s must be a string');
    });
  });

  describe('endsWith', () => {
    it('returns true for an empty string ending with an empty string', () => {
      const endsWith = getStringMethod('', 'endsWith');
      expect(endsWith.callFunction(mockContext, [createStringValue('')])).toEqualTsBoolean(true);
    });

    it('returns true for a non-empty string ending with an empty string', () => {
      const endsWith = getStringMethod('abalone', 'endsWith');
      expect(endsWith.callFunction(mockContext, [createStringValue('')])).toEqualTsBoolean(true);
    });

    it('returns true if a non-empty string ends with a non-empty string', () => {
      const endsWith = getStringMethod('abalone', 'endsWith');
      expect(endsWith.callFunction(mockContext, [createStringValue('one')])).toEqualTsBoolean(true);
    });

    it('returns false if a non-empty string does not end with a non-empty string', () => {
      const endsWith = getStringMethod('abalone', 'endsWith');
      expect(endsWith.callFunction(mockContext, [createStringValue('nope')])).toEqualTsBoolean(false);
    });

    it('throws if passed a non-string', () => {
      const endsWith = getStringMethod('abalone', 'endsWith');
      expect(() => endsWith.callFunction(mockContext, [createBooleanValue(true)])).toThrow('endsWith(s) s must be a string');
    });
  });

  describe('trim', () => {
    it('trims an empty string to an empty string', () => {
      const trim = getStringMethod('', 'trim');
      expect(trim.callFunction(mockContext, [])).toEqualTsString('');
    });

    it('leaves an unpadded string alone', () => {
      const trim = getStringMethod('I have a ham radio', 'trim');
      expect(trim.callFunction(mockContext, [])).toEqualTsString('I have a ham radio');
    });

    it('trims whitespace from the beginning of the string', () => {
      const trim = getStringMethod('   I have a ham radio', 'trim');
      expect(trim.callFunction(mockContext, [])).toEqualTsString('I have a ham radio');
    });

    it('trims whitespace from the end of the string', () => {
      const trim = getStringMethod('I have a ham radio        ', 'trim');
      expect(trim.callFunction(mockContext, [])).toEqualTsString('I have a ham radio');
    });

    it('trims whitespace from both ends of the string', () => {
      const trim = getStringMethod('      I have a ham radio        ', 'trim');
      expect(trim.callFunction(mockContext, [])).toEqualTsString('I have a ham radio');
    });
  });

  describe('trimLeft', () => {
    it('trims an empty string to an empty string', () => {
      const trimLeft = getStringMethod('', 'trimLeft');
      expect(trimLeft.callFunction(mockContext, [])).toEqualTsString('');
    });

    it('leaves a string with no left-padding alone', () => {
      const trimLeft = getStringMethod('I have a ham radio        ', 'trimLeft');
      expect(trimLeft.callFunction(mockContext, [])).toEqualTsString('I have a ham radio        ');
    });

    it('trims whitespace from the beginning of the string', () => {
      const trimLeft = getStringMethod('   I have a ham radio', 'trimLeft');
      expect(trimLeft.callFunction(mockContext, [])).toEqualTsString('I have a ham radio');
    });

    it('trims whitespace only from the beginning of the string', () => {
      const trimLeft = getStringMethod('      I have a ham radio        ', 'trimLeft');
      expect(trimLeft.callFunction(mockContext, [])).toEqualTsString('I have a ham radio        ');
    });
  });

  describe('trimRight', () => {
    it('trims an empty string to an empty string', () => {
      const trimRight = getStringMethod('', 'trimRight');
      expect(trimRight.callFunction(mockContext, [])).toEqualTsString('');
    });

    it('leaves a string with no right-padding alone', () => {
      const trimRight = getStringMethod('       I have a ham radio', 'trimRight');
      expect(trimRight.callFunction(mockContext, [])).toEqualTsString('       I have a ham radio');
    });

    it('trims whitespace from the end of the string', () => {
      const trimRight = getStringMethod('I have a ham radio        ', 'trimRight');
      expect(trimRight.callFunction(mockContext, [])).toEqualTsString('I have a ham radio');
    });

    it('trims whitespace only from the end of the string', () => {
      const trimRight = getStringMethod('      I have a ham radio        ', 'trimRight');
      expect(trimRight.callFunction(mockContext, [])).toEqualTsString('      I have a ham radio');
    });
  });
});
