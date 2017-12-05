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
const expect = chai.expect;

import { createStringValue } from '../../src/values/string';
import { createNumericValue } from '../../src/values/numeric';
import { valueTypes } from '../../src/values/types';

describe('string value', () => {
  let value;

  describe('containing a non-empty string', () => {
    beforeEach(() => {
      value = createStringValue('I have a ham radio');
    });

    it('has type STRING', () => {
      expect(value.type).to.equal(valueTypes.STRING);
    });

    it('has numeric value of NaN', () => {
      expect(value.asNativeNumber()).to.be.NaN;
    });

    it('has a string value of itself', () => {
      expect(value.asNativeString()).to.equal('I have a ham radio');
    });

    it('has a boolean value of true', () => {
      expect(value.asNativeBoolean()).to.be.true;
    });

    describe('equivalency', () => {
      it('is equal to the same string', () => {
        expect(value.equals({}, createStringValue('I have a ham radio'))).to.be.true;
      });

      it('is not equal to a different string', () => {
        expect(value.equals({}, createStringValue('I do not have a ham radio'))).to.be.false;
      });
    });

    describe('properties', () => {
      describe('length', () => {
        let length;

        beforeEach(() => {
          length = value.getProperty({}, createStringValue('length'));
        });

        it('is numeric', () => {
          expect(length.type).to.equal(valueTypes.NUMBER);
        });

        it('is correct', () => {
          expect(length.asNativeNumber()).to.equal(18);
        });
      });

      describe('unrecognized...', () => {
        it('throws', () => {
          expect(() => value.getProperty({}, createStringValue('unrecognized'))).to.throw('String has no member unrecognized');
        });
      });
    });

    it('throws when asked to set a property', () => {
      expect(() => value.setProperty({}, 'anything', 'anything')).to.throw('Cannot set property on string');
    });

    describe('elements', () => {
      let element;

      describe('within the string', () => {
        beforeEach(() => {
          element = value.getElement({}, createNumericValue(0));
        });

        it('gets elements as strings', () => {
          expect(element.type).to.equal(valueTypes.STRING);
        });

        it('gets the correct character', () => {
          expect(element.asNativeString()).to.equal('I');
        });
      });

      describe('reverse-indexed', () => {
        beforeEach(() => {
          element = value.getElement({}, createNumericValue(-2));
        });

        it('gets elements as strings', () => {
          expect(element.type).to.equal(valueTypes.STRING);
        });

        it('gets the correct character', () => {
          expect(element.asNativeString()).to.equal('i');
        });
      });

      it('returns undefined when asked for elements outside the string', () => {
        expect(value.getElement({}, createNumericValue(100)).type).to.equal(valueTypes.UNDEFINED);
      });
    });

    it('throws when called', () => {
      expect(() => value.callFunction()).to.throw('Cannot call string');
    });
  });

  describe('containing an empty string', () => {
    beforeEach(() => {
      value = createStringValue('');
    });

    it('has type STRING', () => {
      expect(value.type).to.equal(valueTypes.STRING);
    });

    it('has numeric value of NaN', () => {
      expect(value.asNativeNumber()).to.equal(0);
    });

    it('has a string value of itself', () => {
      expect(value.asNativeString()).to.equal('');
    });

    it('has a boolean value of false', () => {
      expect(value.asNativeBoolean()).to.be.false;
    });

    describe('equivalency', () => {
      it('is equal to the same string', () => {
        expect(value.equals({}, createStringValue(''))).to.be.true;
      });

      it('is not equal to a different string', () => {
        expect(value.equals({}, createStringValue('I do not have a ham radio'))).to.be.false;
      });
    });

    describe('properties', () => {
      describe('length', () => {
        let length;

        beforeEach(() => {
          length = value.getProperty({}, createStringValue('length'));
        });

        it('is numeric', () => {
          expect(length.type).to.equal(valueTypes.NUMBER);
        });

        it('is correct', () => {
          expect(length.asNativeNumber()).to.equal(0);
        });
      });

      describe('empty', () => {
        let empty;

        beforeEach(() => {
          empty = value.getProperty({}, createStringValue('empty'));
        });

        it('is boolean', () => {
          expect(empty.type).to.equal(valueTypes.BOOLEAN);
        });

        it('is correct', () => {
          expect(empty.asNativeBoolean()).to.be.true;
        });
      });

      describe('unrecognized...', () => {
        it('throws', () => {
          expect(() => value.getProperty({}, createStringValue('unrecognized'))).to.throw('String has no member unrecognized');
        });
      });
    });

    it('throws when asked to set a property', () => {
      expect(() => value.setProperty({}, 'anything', 'anything')).to.throw('Cannot set property on string');
    });

    describe('elements', () => {
      it('returns undefined when asked for elements outside the string', () => {
        expect(value.getElement({}, createNumericValue(100)).type).to.equal(valueTypes.UNDEFINED);
      });
    });

    it('throws when called', () => {
      expect(() => value.callFunction()).to.throw('Cannot call string');
    });
  });

  describe('with numeric value', () => {
    beforeEach(() => {
      value = createStringValue('123');
    });

    it('converts to a number', () => {
      expect(value.asNativeNumber()).to.equal(123);
    });
  });
});
