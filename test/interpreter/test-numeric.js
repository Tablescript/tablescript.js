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

import { createNumericValue } from '../../src/interpreter/numeric';
import { createStringValue } from '../../src/interpreter/string';
import { valueTypes } from '../../src/interpreter/types';

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
        expect(value.equals({}, createNumericValue(1))).to.be.true;
      });

      it('is not equal to a different value', () => {
        expect(value.equals({}, createNumericValue(99))).to.be.false;
      });
    });

    describe('properties', () => {
      describe('upto', () => {
        let upto;

        beforeEach(() => {
          upto = value.getProperty({}, createStringValue('upto'));
        });

        it('is a function', () => {
          expect(upto.type).to.equal(valueTypes.FUNCTION);
        });

        describe('a number greater than itself', () => {
          let results;

          beforeEach(() => {
            results = upto.callFunction({}, {}, [createNumericValue(10)]);
          });

          it('returns an array', () => {
            expect(results.type).to.equal(valueTypes.ARRAY);
          });

          it('contains the numbers up to but not including the higher number', () => {
            expect(results.asNativeArray()).to.eql([1,2,3,4,5,6,7,8,9]);
          });
        });

        describe('a number equal to itself', () => {
          let results;

          beforeEach(() => {
            results = upto.callFunction({}, {}, [createNumericValue(1)]);
          });

          it('returns an array', () => {
            expect(results.type).to.equal(valueTypes.ARRAY);
          });

          it('returns an empty array', () => {
            expect(results.asNativeArray()).to.be.empty;
          });
        });

        describe('a number less than itself', () => {
          let results;

          beforeEach(() => {
            results = upto.callFunction({}, {}, [createNumericValue(0)]);
          });

          it('returns an array', () => {
            expect(results.type).to.equal(valueTypes.ARRAY);
          });

          it('returns an empty array', () => {
            expect(results.asNativeArray()).to.be.empty;
          });
        });

        describe('with a non-numeric parameter', () => {
          let results;

          beforeEach(() => {
            results = upto.callFunction({}, {}, [createStringValue('I have a ham radio')]);
          });

          it('returns an array', () => {
            expect(results.type).to.equal(valueTypes.ARRAY);
          });

          it('returns an empty array', () => {
            expect(results.asNativeArray()).to.be.empty;
          });
        });

        it('throws with no parameters', () => {
          expect(() => upto.callFunction({}, {}, [])).to.throw('upto(n) takes 1 numeric parameter');
        });
      });
    });

    it('throws when asked to set a property', () => {
      expect(() => value.setProperty({}, 'anything')).to.throw('Cannot set property on numeric');
    });

    it('throws when asked to get element', () => {
      expect(() => value.getElement({}, 'anything')).to.throw('Cannot get element of numeric');
    });

    it('throws when called', () => {
      expect(() => value.callFunction()).to.throw('Cannot call numeric');
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
