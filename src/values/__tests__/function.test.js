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

import { valueTypes, isNumeric } from '../types';
import { createNumericValue } from '../numeric';
import { createStringValue } from '../string';
import { createNativeFunctionValue, createFunctionValue } from '../function';
import { isStringValue, isNumericValue, isBooleanValue, isArrayValue } from '../../__tests__/util';
import { createBooleanValue } from '../boolean';
import { createArrayValue } from '../array';
import { createUndefined } from '../undefined';

describe('function', () => {
  describe('createNativeFunctionValue', () => {
    let value;

    beforeEach(() => {
      value = createNativeFunctionValue([], () => undefined);
    });

    it('has type FUNCTION', () => {
      expect(value.type).to.equal(valueTypes.FUNCTION);
    });

    it('has native value "function(native)"', () => {
      expect(value.asNativeValue()).to.equal('function(native)');
    });

    it('throws when converted to a native number', () => {
      expect(() => value.asNativeNumber()).to.throw('Cannot cast FUNCTION to number');
    });

    it('has native string value "function(native)"', () => {
      expect(value.asNativeString()).to.equal('function(native)');
    });

    it('has native boolean value true', () => {
      expect(value.asNativeBoolean()).to.be.true;
    });

    it('is not equal to anything', () => {
      expect(value.nativeEquals()).to.be.false;
    });

    it('throws when converted to number', () => {
      expect(() => value.asNumber()).to.throw('Cannot cast FUNCTION to number');
    });

    it('has string value "function(native)"', () => {
      expect(value.asString()).to.satisfy(isStringValue('function(native)'));
    });

    it('has boolean value true', () => {
      expect(value.asBoolean()).to.satisfy(isBooleanValue(true));
    });

    it('throws when asked for a property', () => {
      expect(() => value.getProperty()).to.throw('Cannot get property of FUNCTION');
    });

    it('throws when asked to set a property', () => {
      expect(() => value.setProperty()).to.throw('Cannot set property of FUNCTION');
    });

    it('throws when asked for an element', () => {
      expect(() => value.getElement()).to.throw('Cannot get element of FUNCTION');
    });

    describe('callFunction', () => {
      describe('with no formal parameters', () => {
        it('sets the arguments variable', () => {
          const f = createNativeFunctionValue([], (context, scope) => scope['arguments']);
          return expect(f.callFunction({}, [createStringValue('string'), createNumericValue(12), createBooleanValue(true)])).to.eventually.satisfy(isArrayValue(['string', 12, true]));
        });

        it('returns the result of the call', () => {
          const f = createNativeFunctionValue([], (context, scope) => createNumericValue(12));
          return expect(f.callFunction({}, [])).to.eventually.satisfy(isNumericValue(12));
        });
      });

      describe('with formal parameters', () => {
        it('sets the arguments variable', () => {
          const f = createNativeFunctionValue(['p1', 'p2'], (context, scope) => scope['arguments']);
          return expect(f.callFunction({}, [createStringValue('string'), createNumericValue(12), createBooleanValue(true)])).to.eventually.satisfy(isArrayValue(['string', 12, true]));
        });

        it('sets the parameters', () => {
          const f = createNativeFunctionValue(['p1', 'p2'], (context, scope) => createArrayValue([scope['p1'], scope['p2']]));
          return expect(f.callFunction({}, [createStringValue('string'), createNumericValue(12)])).to.eventually.satisfy(isArrayValue(['string', 12]));
        });

        it('does not set un-passed parameters', () => {
          const f = createNativeFunctionValue(['p1', 'p2'], (context, scope) => createArrayValue([scope['p1'], scope['p2'] || createUndefined()]));
          return expect(f.callFunction({}, [createStringValue('string')])).to.eventually.satisfy(isArrayValue(['string', undefined]));
        });
      });
    });
  });

  describe('createFunctionValue', () => {
    let value;

    beforeEach(() => {
      value = createFunctionValue([], {}, {});
    });

    it('has type FUNCTION', () => {
      expect(value.type).to.equal(valueTypes.FUNCTION);
    });

    it('has native value "function"', () => {
      expect(value.asNativeValue()).to.equal('function');
    });

    it('throws when converted to a native number', () => {
      expect(() => value.asNativeNumber()).to.throw('Cannot cast FUNCTION to number');
    });

    it('has native string value "function"', () => {
      expect(value.asNativeString()).to.equal('function');
    });

    it('has native boolean value true', () => {
      expect(value.asNativeBoolean()).to.be.true;
    });

    it('is not equal to anything', () => {
      expect(value.nativeEquals()).to.be.false;
    });

    it('throws when converted to number', () => {
      expect(() => value.asNumber()).to.throw('Cannot cast FUNCTION to number');
    });

    it('has string value "function"', () => {
      expect(value.asString()).to.satisfy(isStringValue('function'));
    });

    it('has boolean value true', () => {
      expect(value.asBoolean()).to.satisfy(isBooleanValue(true));
    });

    it('throws when asked for a property', () => {
      expect(() => value.getProperty()).to.throw('Cannot get property of FUNCTION');
    });

    it('throws when asked to set a property', () => {
      expect(() => value.setProperty()).to.throw('Cannot set property of FUNCTION');
    });

    it('throws when asked for an element', () => {
      expect(() => value.getElement()).to.throw('Cannot get element of FUNCTION');
    });

    describe('callFunction', () => {
      describe('with no formal parameters', () => {
        it('sets the arguments variable', () => {
          const f = createFunctionValue([], { evaluate: scope => scope['arguments'] }, {});
          return expect(f.callFunction({}, [createStringValue('string'), createNumericValue(12), createBooleanValue(true)])).to.eventually.satisfy(isArrayValue(['string', 12, true]));
        });

        it('sets scope from closure', () => {
          const f = createFunctionValue([], { evaluate: scope => scope['fromClosure'] }, { fromClosure: createNumericValue(12) });
          return expect(f.callFunction({}, [])).to.eventually.satisfy(isNumericValue(12));
        });

        it('overrides closure scope with parameters', () => {
          const f = createFunctionValue([], { evaluate: scope => scope['arguments'] }, { 'arguments': createNumericValue(12) });
          return expect(f.callFunction({}, [createNumericValue(13)])).to.eventually.satisfy(isArrayValue([13]));
        });
      });

      describe('with formal parameters', () => {
        it('sets the arguments variable', () => {
          const f = createFunctionValue(['p1', 'p2'], { evaluate: scope => scope['arguments'] }, {});
          return expect(f.callFunction({}, [createStringValue('string'), createNumericValue(12), createBooleanValue(true)])).to.eventually.satisfy(isArrayValue(['string', 12, true]));
        });

        it('sets the parameters', () => {
          const f = createFunctionValue(['p1', 'p2'], { evaluate: scope => createArrayValue([scope['p1'], scope['p2']]) }, {});
          return expect(f.callFunction({}, [createStringValue('string'), createNumericValue(12)])).to.eventually.satisfy(isArrayValue(['string', 12]));
        });

        it('does not set un-passed parameters', () => {
          const f = createFunctionValue(['p1', 'p2'], { evaluate: scope => createArrayValue([scope['p1'], scope['p2'] || createUndefined()]) }, {});
          return expect(f.callFunction({}, [createStringValue('string')])).to.eventually.satisfy(isArrayValue(['string', undefined]));
        });

        it('overrides closure scope with parameters', () => {
          const f = createFunctionValue(['p1', 'p2'], { evaluate: scope => createArrayValue([scope['p1'], scope['p2']]) }, { p2: createStringValue('not this') });
          return expect(f.callFunction({}, [createNumericValue(12), createNumericValue(13)])).to.eventually.satisfy(isArrayValue([12, 13]));
        });

        it('does not override closure scope with un-passed parameters', () => {
          const f = createFunctionValue(['p1', 'p2'], { evaluate: scope => createArrayValue([scope['p1'], scope['p2']]) }, { p2: createStringValue('this') });
          return expect(f.callFunction({}, [createNumericValue(12)])).to.eventually.satisfy(isArrayValue([12, 'this']));
        });
      });
    });
  });
});
