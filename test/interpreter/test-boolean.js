import chai from 'chai';
const expect = chai.expect;

import { createBooleanValue } from '../../src/interpreter/boolean';
import { createStringValue } from '../../src/interpreter/string';
import { valueTypes } from '../../src/interpreter/types';

describe('boolean', () => {
  describe('when true', () => {
    let value;

    beforeEach(() => {
      value = createBooleanValue(true);
    });

    it('is of type BOOLEAN', () => {
      expect(value.type).to.equal(valueTypes.BOOLEAN);
    });

    it('has a numeric value of 1', () => {
      expect(value.asNativeNumber()).to.equal(1);
    });

    it('has a string value of "true"', () => {
      expect(value.asNativeString()).to.equal('true');
    });

    describe('equivalency', () => {
      it('equals another value that is also true', () => {
        expect(value.equals({}, createBooleanValue(true))).to.be.true;
      });

      it('does not equal another value that is not true', () => {
        expect(value.equals({}, createBooleanValue(false))).to.be.false;
      });
    });

    it('throws when asked for a property', () => {
      expect(() => value.getProperty({}, createStringValue('anything'))).to.throw('Cannot get property of boolean');
    });

    it('throws when told to set a property', () => {
      expect(() => value.setProperty({}, 'anything', 'anything')).to.throw('Cannot set property of boolean');
    });

    it('throws when asked for an element', () => {
      expect(() => value.getElement({}, 9)).to.throw('Cannot get element of boolean');
    });

    it('throws when called', () => {
      expect(() => value.callFunction()).to.throw('Cannot call boolean');
    });
  });

  describe('when false', () => {
    let value;

    beforeEach(() => {
      value = createBooleanValue(false);
    });

    it('is of type BOOLEAN', () => {
      expect(value.type).to.equal(valueTypes.BOOLEAN);
    });

    it('has a numeric value of 0', () => {
      expect(value.asNativeNumber()).to.equal(0);
    });

    it('has a string value of "false"', () => {
      expect(value.asNativeString()).to.equal('false');
    });

    describe('equivalency', () => {
      it('equals another value that is also false', () => {
        expect(value.equals({}, createBooleanValue(false))).to.be.true;
      });

      it('does not equal another value that is not false', () => {
        expect(value.equals({}, createBooleanValue(true))).to.be.false;
      });
    });

    it('throws when asked for a property', () => {
      expect(() => value.getProperty({}, createStringValue('anything'))).to.throw('Cannot get property of boolean');
    });

    it('throws when told to set a property', () => {
      expect(() => value.setProperty({}, 'anything', 'anything')).to.throw('Cannot set property of boolean');
    });

    it('throws when asked for an element', () => {
      expect(() => value.getElement({}, 9)).to.throw('Cannot get element of boolean');
    });

    it('throws when called', () => {
      expect(() => value.callFunction()).to.throw('Cannot call boolean');
    });
  });
});
