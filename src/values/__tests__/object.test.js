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

import { createObjectValue } from '../object';
import { createNumericValue } from '../numeric';
import { createStringValue } from '../string';
import { createArrayValue } from '../array';
import { valueTypes } from '../types';

xdescribe('object value', () => {
  let dummyObject;
  let value;

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
      expect(value.type).to.equal(valueTypes.OBJECT);
    });

    it('throws when asked for its numeric value', () => {
      expect(() => value.asNativeNumber()).to.throw('Cannot cast OBJECT to number');
    });

    it('returns a json-y value when asked for its string value', () => {
      expect(value.asNativeString()).to.equal('{"a":1,"b":"I have a ham radio","c":[2,"FizzBuzz"]}');
    });

    it('is true', () => {
      expect(value.asNativeBoolean()).to.be.true;
    });

    it('has a native object value', () => {
      expect(value.asNativeObject()).to.eql({
        a: 1,
        b: 'I have a ham radio',
        c: [2, 'FizzBuzz'],
      });
    });

    describe('properties', () => {
      let prop;

      describe('a', () => {
        beforeEach(() => {
          prop = value.getProperty({}, createStringValue('a'));
        });

        it('is a number', () => {
          expect(prop.type).to.equal(valueTypes.NUMBER);
        });

        it('has the right value', () => {
          expect(prop.asNativeNumber()).to.equal(1);
        });
      });

      describe('b', () => {
        beforeEach(() => {
          prop = value.getProperty({}, createStringValue('b'));
        });

        it('is a string', () => {
          expect(prop.type).to.equal(valueTypes.STRING);
        });

        it('has the right value', () => {
          expect(prop.asNativeString()).to.equal('I have a ham radio');
        });
      });

      describe('c', () => {
        beforeEach(() => {
          prop = value.getProperty({}, createStringValue('c'));
        });

        it('is an array', () => {
          expect(prop.type).to.equal(valueTypes.ARRAY);
        });

        it('has the right value', () => {
          expect(prop.asNativeArray()).to.eql([2, 'FizzBuzz']);
        });
      });
    });

    describe('setting properties', () => {
      let prop;

      beforeEach(() => {
        value.setProperty({}, createStringValue('d'), createNumericValue(99));
        prop = value.getProperty({}, createStringValue('d'));
      });

      it('sets', () => {
        expect(prop.asNativeValue()).to.equal(99);
      });
    });

    it('throws when asked for an element', () => {
      expect(() => value.getElement()).to.throw('Cannot get element of OBJECT');
    });

    it('throws when called', () => {
      expect(() => value.callFunction()).to.throw('OBJECT is not callable');
    });
  });

  describe('when empty', () => {
    beforeEach(() => {
      dummyObject = {}
      value = createObjectValue(dummyObject);
    });

    it('has type OBJECT', () => {
      expect(value.type).to.equal(valueTypes.OBJECT);
    });

    it('throws when cast as number', () => {
      expect(() => value.asNativeNumber()).to.throw('Cannot cast OBJECT to number');
    });

    it('has an empty json-ish string value', () => {
      expect(value.asNativeString()).to.equal('{}');
    });

    it('is true', () => {
      expect(value.asNativeBoolean()).to.be.true;
    });

    it('is an empty object', () => {
      expect(value.asNativeObject()).to.eql({});
    });

    describe('equality', () => {
      it('is equal to an empty object', () => {
        expect(value.nativeEquals(createObjectValue({}))).to.be.true;
      });
    });

    describe('properties', () => {
      describe('getting', () => {
        it('returns undefined for non-existent keys', () => {
          expect(value.getProperty({}, createStringValue('not there')).type).to.equal(valueTypes.UNDEFINED);
        });
      });

      describe('setting', () => {
        let property;

        beforeEach(() => {
          value.setProperty({}, createStringValue('newKey'), createNumericValue(99));
          property = value.getProperty({}, createStringValue('newKey'));
        });

        it('sets the right type', () => {
          expect(property.type).to.equal(valueTypes.NUMBER);
        });

        it('sets the right value', () => {
          expect(property.asNativeNumber()).to.equal(99);
        });
      });
    });

    it('throws when asked for an element', () => {
      expect(() => value.getElement()).to.throw('Cannot get element of OBJECT');
    });

    it('throws when called', () => {
      expect(() => value.callFunction()).to.throw('OBJECT is not callable');
    });
  });
});
