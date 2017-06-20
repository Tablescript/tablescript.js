import chai from 'chai';
const expect = chai.expect;

import { valueTypes } from '../../src/interpreter/types';
import { createUndefined } from '../../src/interpreter/undefined';

describe('createUndefined', () => {
  let value;

  beforeEach(() => {
    value = createUndefined();
  });

  describe('native', () => {
    it('has a native value of undefined', () => {
      expect(value.asNativeValue()).to.equal(undefined);
    });

    it('has type UNDEFINED', () => {
      expect(value.type).to.equal(valueTypes.UNDEFINED);
    });

    it('throws when converted to number', () => {
      expect(() => value.asNativeNumber()).to.throw('Cannot cast undefined to numeric');
    });

    it('has string value undefined', () => {
      expect(value.asNativeString()).to.equal('undefined');
    });

    it('is false', () => {
      expect(value.asNativeBoolean()).to.be.false;
    });

    describe('equality', () => {
      it('is equal to another undefined', () => {
        expect(value.equals({}, createUndefined())).to.be.true;
      });

      it('is not equal to anything else', () => {
        expect(value.equals({}, { type: 'anything else' })).to.be.false;
      });
    });
  });

  describe('non-native', () => {
    it('throws when converted to number', () => {
      expect(() => value.asNumber()).to.throw('Cannot cast undefined to numeric');
    });

    describe('as string', () => {
      let stringValue;

      beforeEach(() => {
        stringValue = value.asString();
      });

      it('has a string type', () => {
        expect(stringValue.type).to.equal(valueTypes.STRING);
      });

      it('is "undefined"', () => {
        expect(stringValue.asNativeString()).to.equal('undefined');
      });
    });

    describe('as boolean', () => {
      let booleanValue;

      beforeEach(() => {
        booleanValue = value.asBoolean();
      });

      it('has a boolean type', () => {
        expect(booleanValue.type).to.equal(valueTypes.BOOLEAN);
      });

      it('is false', () => {
        expect(booleanValue.asNativeBoolean()).to.be.false;
      });
    });
  });

  it('throws when asked for a property', () => {
    expect(() => value.getProperty()).to.throw('Cannot get property of undefined');
  });

  it('throws when asked to set property', () => {
    expect(() => value.setProperty()).to.throw('Cannot set property of undefined');
  });

  it('throws when asked for an element', () => {
    expect(() => value.getElement()).to.throw('Cannot get element of undefined');
  });

  it('throws when called', () => {
    expect(() => value.callFunction()).to.throw('Cannot call undefined');
  });
});
