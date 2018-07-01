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

import { stringProperties } from '../string-members';
import { createNumericValue } from '../numeric';
import { valueTypes, isString } from '../types';
import { createStringValue } from '../string';
import { isArrayValue, isStringValue, isBooleanValue, isNumericValue, isUndefined } from '../../__test__/util';
import { createBooleanValue } from '../boolean';

describe('string members', () => {
  describe('split', () => {
    describe('with a non-empty delimiter', () => {
      it('splits an empty string into an array of empty string', () => {
        const split = stringProperties('').split;
        return expect(split.callFunction({}, {}, [createStringValue('|')])).to.eventually.satisfy(isArrayValue(['']));
      });

      it('splits a string into an array of the string', () => {
        const split = stringProperties('john george paul ringo').split;
        return expect(split.callFunction({}, {}, [createStringValue(' ')])).to.eventually.satisfy(isArrayValue(['john', 'george', 'paul', 'ringo']));
      });
    });
    
    describe('with an empty delimiter', () => {
      it('splits an empty string into an array of empty string', () => {
        const split = stringProperties('').split;
        return expect(split.callFunction({}, {}, [])).to.eventually.satisfy(isArrayValue(['']));
      });

      it('splits a string into an array of the string', () => {
        const split = stringProperties('john george paul ringo').split;
        return expect(split.callFunction({}, {}, [])).to.eventually.satisfy(isArrayValue(['john george paul ringo']));
      });
    });

    it('throws if the delimiter is not a string', () => {
      const split = stringProperties('john george paul ringo').split;
      return expect(split.callFunction({}, {}, [createNumericValue(12)])).to.eventually.be.rejectedWith('split(separator) separator must be a string');
    });
  });

  describe('capitalize', () => {
    it('returns an empty string', () => {
      const capitalize = stringProperties('').capitalize;
      return expect(capitalize.callFunction({}, {}, [])).to.eventually.satisfy(isStringValue(''));
    });

    it('capitalizes a single character', () => {
      const capitalize = stringProperties('a').capitalize;
      return expect(capitalize.callFunction({}, {}, [])).to.eventually.satisfy(isStringValue('A'));
    });

    it('capitalizes a string', () => {
      const capitalize = stringProperties('abalone').capitalize;
      return expect(capitalize.callFunction({}, {}, [])).to.eventually.satisfy(isStringValue('Abalone'));
    });

    it('leaves an already capitalized string alone', () => {
      const capitalize = stringProperties('Abalone').capitalize;
      return expect(capitalize.callFunction({}, {}, [])).to.eventually.satisfy(isStringValue('Abalone'));
    });
  });

  describe('uppercase', () => {
    it('returns an empty string', () => {
      const uppercase = stringProperties('').uppercase;
      return expect(uppercase.callFunction({}, {}, [])).to.eventually.satisfy(isStringValue(''));
    });

    it('returns an uppercase version', () => {
      const uppercase = stringProperties('abalone').uppercase;
      return expect(uppercase.callFunction({}, {}, [])).to.eventually.satisfy(isStringValue('ABALONE'));
    });
  });

  describe('lowercase', () => {
    it('returns an empty string', () => {
      const lowercase = stringProperties('').lowercase;
      return expect(lowercase.callFunction({}, {}, [])).to.eventually.satisfy(isStringValue(''));
    });

    it('returns an lowercase version', () => {
      const lowercase = stringProperties('AbaLone').lowercase;
      return expect(lowercase.callFunction({}, {}, [])).to.eventually.satisfy(isStringValue('abalone'));
    });
  });

  describe('includes', () => {
    it('returns false for an empty string', () => {
      const includes = stringProperties('').includes;
      return expect(includes.callFunction({}, {}, [createStringValue('not gonna find it')])).to.eventually.satisfy(isBooleanValue(false));
    });

    it('returns false when no match found', () => {
      const includes = stringProperties('I have a ham radio').includes;
      return expect(includes.callFunction({}, {}, [createStringValue('flung')])).to.eventually.satisfy(isBooleanValue(false));
    });

    it('returns true when a match is found', () => {
      const includes = stringProperties('I have a ham radio').includes;
      return expect(includes.callFunction({}, {}, [createStringValue('ham')])).to.eventually.satisfy(isBooleanValue(true));
    });

    it('throws when passed a non-string', () => {
      const includes = stringProperties('I have a ham radio').includes;
      return expect(includes.callFunction({}, {}, [createBooleanValue(true)])).to.eventually.be.rejectedWith('includes(s) s must be a string');
    })
  });

  describe('indexOf', () => {
    it('returns -1 for an empty string', () => {
      const indexOf = stringProperties('').indexOf;
      return expect(indexOf.callFunction({}, {}, [createStringValue('not gonna find it')])).to.eventually.satisfy(isNumericValue(-1));
    });

    it('returns -1 when no match found', () => {
      const indexOf = stringProperties('I have a ham radio').indexOf;
      return expect(indexOf.callFunction({}, {}, [createStringValue('not gonna find it')])).to.eventually.satisfy(isNumericValue(-1));
    });

    it('returns the index of the match', () => {
      const indexOf = stringProperties('I have a ham radio').indexOf;
      return expect(indexOf.callFunction({}, {}, [createStringValue('ham')])).to.eventually.satisfy(isNumericValue(9));
    });

    it('returns the index of the first match', () => {
      const indexOf = stringProperties('I have a ham radio').indexOf;
      return expect(indexOf.callFunction({}, {}, [createStringValue('ha')])).to.eventually.satisfy(isNumericValue(2));
    });

    it('throws when passed a non-string', () => {
      const indexOf = stringProperties('I have a ham radio').indexOf;
      return expect(indexOf.callFunction({}, {}, [createBooleanValue(true)])).to.eventually.be.rejectedWith('indexOf(s) s must be a string');
    });
  });

  describe('slice', () => {
    it('returns an empty string for an empty string with a start index', () => {
      const slice = stringProperties('').slice;
      return expect(slice.callFunction({}, {}, [createNumericValue(100)])).to.eventually.satisfy(isStringValue(''));
    });

    it('returns an empty string for an empty string with start and end indices', () => {
      const slice = stringProperties('').slice;
      return expect(slice.callFunction({}, {}, [createNumericValue(100), createNumericValue(200)])).to.eventually.satisfy(isStringValue(''));
    });

    it('returns the remainder of a string when passed only a start index', () => {
      const slice = stringProperties('I have a ham radio').slice;
      return expect(slice.callFunction({}, {}, [createNumericValue(7)])).to.eventually.satisfy(isStringValue('a ham radio'));
    });

    it('returns a substring when passed both start and end indices', () => {
      const slice = stringProperties('I have a ham radio').slice;
      return expect(slice.callFunction({}, {}, [createNumericValue(7), createNumericValue(12)])).to.eventually.satisfy(isStringValue('a ham'));
    });

    it('throws when start is not passed', () => {
      const slice = stringProperties('I have a ham radio').slice;
      return expect(slice.callFunction({}, {}, [])).to.eventually.be.rejectedWith('slice(start, end) start must be a number');
    });

    it('throws when start is not a number', () => {
      const slice = stringProperties('I have a ham radio').slice;
      return expect(slice.callFunction({}, {}, [createStringValue('not gonna work')])).to.eventually.be.rejectedWith('slice(start, end) start must be a number');
    });

    it('throws when end is passed but is not a number', () => {
      const slice = stringProperties('I have a ham radio').slice;
      return expect(slice.callFunction({}, {}, [createNumericValue(3), createStringValue('not gonna work')])).to.eventually.be.rejectedWith('slice(start, end) end must be a number');
    });
  });

  describe('startsWith', () => {
    it('returns true for an empty string starting with an empty string', () => {
      const startsWith = stringProperties('').startsWith;
      return expect(startsWith.callFunction({}, {}, [createStringValue('')])).to.eventually.satisfy(isBooleanValue(true));
    });

    it('returns true for a non-empty string starting with an empty string', () => {
      const startsWith = stringProperties('abalone').startsWith;
      return expect(startsWith.callFunction({}, {}, [createStringValue('')])).to.eventually.satisfy(isBooleanValue(true));
    });

    it('returns true if a non-empty string starts with a non-empty string', () => {
      const startsWith = stringProperties('abalone').startsWith;
      return expect(startsWith.callFunction({}, {}, [createStringValue('abalo')])).to.eventually.satisfy(isBooleanValue(true));
    });

    it('returns false if a non-empty string does not start with a non-empty string', () => {
      const startsWith = stringProperties('abalone').startsWith;
      return expect(startsWith.callFunction({}, {}, [createStringValue('nope')])).to.eventually.satisfy(isBooleanValue(false));
    });

    it('throws if passed a non-string', () => {
      const startsWith = stringProperties('abalone').startsWith;
      return expect(startsWith.callFunction({}, {}, [createBooleanValue(true)])).to.eventually.be.rejectedWith('startsWith(s) s must be a string');
    });
  });

  describe('endsWith', () => {
    it('returns true for an empty string ending with an empty string', () => {
      const endsWith = stringProperties('').endsWith;
      return expect(endsWith.callFunction({}, {}, [createStringValue('')])).to.eventually.satisfy(isBooleanValue(true));
    });

    it('returns true for a non-empty string ending with an empty string', () => {
      const endsWith = stringProperties('abalone').endsWith;
      return expect(endsWith.callFunction({}, {}, [createStringValue('')])).to.eventually.satisfy(isBooleanValue(true));
    });

    it('returns true if a non-empty string ends with a non-empty string', () => {
      const endsWith = stringProperties('abalone').endsWith;
      return expect(endsWith.callFunction({}, {}, [createStringValue('one')])).to.eventually.satisfy(isBooleanValue(true));
    });

    it('returns false if a non-empty string does not end with a non-empty string', () => {
      const endsWith = stringProperties('abalone').endsWith;
      return expect(endsWith.callFunction({}, {}, [createStringValue('nope')])).to.eventually.satisfy(isBooleanValue(false));
    });

    it('throws if passed a non-string', () => {
      const endsWith = stringProperties('abalone').endsWith;
      return expect(endsWith.callFunction({}, {}, [createBooleanValue(true)])).to.eventually.be.rejectedWith('endsWith(s) s must be a string');
    });
  });

  describe('trim', () => {
    it('trims an empty string to an empty string', () => {
      const trim = stringProperties('').trim;
      return expect(trim.callFunction({}, {}, [])).to.eventually.satisfy(isStringValue(''));
    });

    it('leaves an unpadded string alone', () => {
      const trim = stringProperties('I have a ham radio').trim;
      return expect(trim.callFunction({}, {}, [])).to.eventually.satisfy(isStringValue('I have a ham radio'));
    });

    it('trims whitespace from the beginning of the string', () => {
      const trim = stringProperties('   I have a ham radio').trim;
      return expect(trim.callFunction({}, {}, [])).to.eventually.satisfy(isStringValue('I have a ham radio'));
    });

    it('trims whitespace from the end of the string', () => {
      const trim = stringProperties('I have a ham radio        ').trim;
      return expect(trim.callFunction({}, {}, [])).to.eventually.satisfy(isStringValue('I have a ham radio'));
    });

    it('trims whitespace from both ends of the string', () => {
      const trim = stringProperties('      I have a ham radio        ').trim;
      return expect(trim.callFunction({}, {}, [])).to.eventually.satisfy(isStringValue('I have a ham radio'));
    });
  });

  describe('trimLeft', () => {
    it('trims an empty string to an empty string', () => {
      const trimLeft = stringProperties('').trimLeft;
      return expect(trimLeft.callFunction({}, {}, [])).to.eventually.satisfy(isStringValue(''));
    });

    it('leaves a string with no left-padding alone', () => {
      const trimLeft = stringProperties('I have a ham radio        ').trimLeft;
      return expect(trimLeft.callFunction({}, {}, [])).to.eventually.satisfy(isStringValue('I have a ham radio        '));
    });

    it('trims whitespace from the beginning of the string', () => {
      const trimLeft = stringProperties('   I have a ham radio').trimLeft;
      return expect(trimLeft.callFunction({}, {}, [])).to.eventually.satisfy(isStringValue('I have a ham radio'));
    });

    it('trims whitespace only from the beginning of the string', () => {
      const trimLeft = stringProperties('      I have a ham radio        ').trimLeft;
      return expect(trimLeft.callFunction({}, {}, [])).to.eventually.satisfy(isStringValue('I have a ham radio        '));
    });
  });

  describe('trimRight', () => {
    it('trims an empty string to an empty string', () => {
      const trimRight = stringProperties('').trimRight;
      return expect(trimRight.callFunction({}, {}, [])).to.eventually.satisfy(isStringValue(''));
    });

    it('leaves a string with no right-padding alone', () => {
      const trimRight = stringProperties('       I have a ham radio').trimRight;
      return expect(trimRight.callFunction({}, {}, [])).to.eventually.satisfy(isStringValue('       I have a ham radio'));
    });

    it('trims whitespace from the end of the string', () => {
      const trimRight = stringProperties('I have a ham radio        ').trimRight;
      return expect(trimRight.callFunction({}, {}, [])).to.eventually.satisfy(isStringValue('I have a ham radio'));
    });

    it('trims whitespace only from the end of the string', () => {
      const trimRight = stringProperties('      I have a ham radio        ').trimRight;
      return expect(trimRight.callFunction({}, {}, [])).to.eventually.satisfy(isStringValue('      I have a ham radio'));
    });
  });
});
