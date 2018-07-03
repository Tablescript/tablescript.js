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

import { valueTypes } from '../types';
import { createNumericValue } from '../numeric';
import { createNativeFunctionValue, createFunctionValue } from '../function';

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

    describe('as string', () => {
      let stringValue;

      beforeEach(() => {
        stringValue = value.asString();
      });

      it('has type STRING', () => {
        expect(stringValue.type).to.equal(valueTypes.STRING);
      });

      it('has value "function(native)"', () => {
        expect(stringValue.asNativeString()).to.equal('function(native)');
      });
    });

    describe('as boolean', () => {
      let booleanValue;

      beforeEach(() => {
        booleanValue = value.asBoolean();
      });

      it('has type BOOLEAN', () => {
        expect(booleanValue.type).to.equal(valueTypes.BOOLEAN);
      });

      it('has value true', () => {
        expect(booleanValue.asNativeBoolean()).to.be.true;
      });
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

    describe('with no formal parameters', () => {
      let calledScope;
      let callCount;

      beforeEach(() => {
        callCount = 0;
        const nativeFunction = (context, scope) => {
          calledScope = scope;
          callCount += 1;
          return 97;
        };
        value = createNativeFunctionValue([], nativeFunction);
      });

      describe('when called', () => {
        it('evaluates the block', () => {
          value.callFunction({}, []);
          expect(callCount).to.equal(1);
        });

        it('returns the result of executing the body', () => {
          value.callFunction({}, []).then(result => {
            expect(result).to.equal(97);
          });
        });

        it('overrides calling scope with closure scope', () => {
          value.callFunction({}, []);
          expect(calledScope).to.eql({});
        });
      });

      describe('when called with no parameters', () => {
        it('calls evaluate with proper scope', () => {
          value.callFunction({}, []);
          expect(calledScope).to.eql({});
        });
      });

      it('throws when called with too many parameters', () => {
        value.callFunction({}, [4, 4, 4]).catch(e => {
          expect(e).to.equal('function call expected 0 parameters but got 3');
        });
      });
    });

    describe('with formal parameters', () => {
      let calledScope;
      let callCount;

      beforeEach(() => {
        callCount = 0;
        const nativeFunction = (context, scope) => {
          calledScope = scope;
          callCount += 1;
          return 97;
        };
        value = createNativeFunctionValue(['a', 'b'], nativeFunction);
      });

      describe('when called', () => {
        it('evaluates the block', () => {
          value.callFunction({}, []);
          expect(callCount).to.equal(1);
        });

        it('returns the result of executing the body', () => {
          value.callFunction({}, []).then(result => {
            expect(result).to.equal(97);
          });
        });
      });

      describe('when called with no parameters', () => {
        it('calls evaluate with proper scope', () => {
          value.callFunction({}, []);
          expect(calledScope).to.eql({});
        });
      });

      describe('when called with the correct number of parameters', () => {
        it('calls evaluate with proper scope', () => {
          value.callFunction({}, ['I have a ham radio', 12]);
          expect(calledScope).to.eql({ a: 'I have a ham radio', b: 12 });
        });
      });

      it('throws when called with too many parameters', () => {
        value.callFunction({}, [4, 4, 4]).catch(e => {
          expect(e).to.equal('function call expected 2 parameters but got 3');
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

    describe('as string', () => {
      let stringValue;

      beforeEach(() => {
        stringValue = value.asString();
      });

      it('has type STRING', () => {
        expect(stringValue.type).to.equal(valueTypes.STRING);
      });

      it('has value "function"', () => {
        expect(stringValue.asNativeString()).to.equal('function');
      });
    });

    describe('as boolean', () => {
      let booleanValue;

      beforeEach(() => {
        booleanValue = value.asBoolean();
      });

      it('has type BOOLEAN', () => {
        expect(booleanValue.type).to.equal(valueTypes.BOOLEAN);
      });

      it('has value true', () => {
        expect(booleanValue.asNativeBoolean()).to.be.true;
      });
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

    describe('with no formal parameters', () => {
      let mockBody;
      let mockClosure;

      beforeEach(() => {
        mockBody = {
          evaluate: () => undefined
        };
        mockClosure = { closureScope: 63 };
        value = createFunctionValue([], mockBody, mockClosure);
      });

      describe('when called', () => {
        it('evaluates the block', () => {
          let callCount = 0;
          mockBody.evaluate = _ => {
            callCount += 1;
          };
          value.callFunction({}, []);
          expect(callCount).to.equal(1);
        });

        it('returns the result of executing the body', () => {
          mockBody.evaluate = () => 97;
          value.callFunction({}, []).then(result => {
            expect(result).to.equal(97);
          });
        });

        it('overrides calling scope with closure scope', () => {
          mockClosure.callingScope = 'overridden';
          let calledScope = {};
          mockBody.evaluate = scope => {
            calledScope = scope;
          };
          value.callFunction({}, []);
          expect(calledScope).to.eql({ callingScope: 'overridden', closureScope: 63 });
        });
      });

      describe('when called with no parameters', () => {
        it('calls evaluate with proper scope', () => {
          let calledScope = {};
          mockBody.evaluate = scope => {
            calledScope = scope;
          };
          value.callFunction({}, []);
          expect(calledScope).to.eql({ closureScope: 63 });
        });
      });

      it('throws when called with too many parameters', () => {
        value.callFunction({}, [4, 4, 4]).catch(e => {
          expect(e).to.equal('function call expected 0 parameters but got 3');
        });
      });
    });

    describe('with formal parameters', () => {
      let mockBody;
      let mockClosure;

      beforeEach(() => {
        mockBody = {
          evaluate: () => undefined
        };
        mockClosure = { closureScope: 63 };
        value = createFunctionValue(['a', 'b'], mockBody, mockClosure);
      });

      describe('when called', () => {
        it('evalutes the block', () => {
          let callCount = 0;
          mockBody.evaluate = _ => {
            callCount += 1;
          };
          value.callFunction({}, []);
          expect(callCount).to.equal(1);
        });

        it('returns the result of executing the body', () => {
          mockBody.evaluate = () => createNumericValue(97);
          value.callFunction({}, []).then(result => {
            expect(result.asNativeNumber()).to.equal(97);
          });
        });
      });

      describe('when called with no parameters', () => {
        it('calls evaluate with proper scope', () => {
          let calledScope = {};
          mockBody.evaluate = scope => {
            calledScope = scope;
          };
          value.callFunction({}, []);
          expect(calledScope).to.eql({ closureScope: 63 });
        });
      });

      describe('when called with the correct number of parameters', () => {
        it('calls evaluate with proper scope', () => {
          let calledScope = {};
          mockBody.evaluate = scope => {
            calledScope = scope;
          };
          value.callFunction({}, ['I have a ham radio', 12]);
          expect(calledScope).to.eql({ closureScope: 63, a: 'I have a ham radio', b: 12 });
        });
      });

      it('throws when called with too many parameters', () => {
        value.callFunction({}, [4, 4, 4]).catch(e => {
          expect(e).to.equal('function call expected 2 parameters but got 3');
        });
      });
    });
  });
});
