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
import { createStringValue } from '../string';
import { createNumericValue } from '../numeric';
import { createBooleanValue } from '../boolean';
import { createUndefined } from '../undefined';
import { createArrayValue } from '../array';
import { TablescriptError } from '../../error';
import { isUndefined } from '../../__test__/util';

describe('array', () => {
  const nonEmptyArray = () => createArrayValue([createStringValue('I have a ham radio'), createNumericValue(12), createBooleanValue(false)]);
  const emptyArray = () => createArrayValue([]);

  describe('with an initial value', () => {
    let value;

    beforeEach(() => {
      value = nonEmptyArray();
    });

    it('has an ARRAY type', () => {
      expect(value.type).to.equal(valueTypes.ARRAY);
    });

    it('throws if cast as a number', () => {
      expect(() => value.asNativeNumber()).to.throw('Cannot cast ARRAY to number');
    });

    it('has a JSON-ish string representation', () => {
      expect(value.asNativeString()).to.equal('["I have a ham radio",12,false]');
    });

    it('is true', () => {
      expect(value.asNativeBoolean()).to.be.true;
    });

    it('has a native array representation', () => {
      expect(value.asNativeArray()).to.eql(['I have a ham radio', 12, false]);
    });

    describe('equality', () => {
      it('is equal to the same non-empty array', () => {
        expect(value.equals({}, nonEmptyArray())).to.be.true;
      });
    });

    describe('properties', () => {
      it('returns undefined for non-method properties', () => {
        expect(value.getProperty({}, createStringValue('not there')).type).to.equal(valueTypes.UNDEFINED);
      });

      describe('set', () => {

      });
    });
  });

  describe('empty', () => {
  });

  describe('methods', () => {
    describe('length', () => {
      let value;
      let property;

      describe('non-empty', () => {
        beforeEach(() => {
          value = nonEmptyArray();
          property = value.getProperty({}, createStringValue('length'));
        });

        it('is numeric', () => {
          expect(property.type).to.equal(valueTypes.NUMBER);
        });

        it('has the right count', () => {
          expect(property.asNativeNumber()).to.equal(3);
        });
      });

      describe('empty', () => {
        beforeEach(() => {
          value = emptyArray();
          property = value.getProperty({}, createStringValue('length'));
        });

        it('is numeric', () => {
          expect(property.type).to.equal(valueTypes.NUMBER);
        });

        it('has the right count', () => {
          expect(property.asNativeNumber()).to.equal(0);
        });
      });
    });

    describe('includes', () => {
      let value;
      let method;
      let result;

      describe('non-empty', () => {
        beforeEach(() => {
          value = nonEmptyArray();
          method = value.getProperty({}, createStringValue('includes'));
        });

        it('is a function', () => {
          expect(method.type).to.equal(valueTypes.FUNCTION);
        });

        describe('when called with no parameters', () => {
          beforeEach(() => {
            result = method.callFunction({}, {}, []);
          });

          it('returns undefined', () => {
            return expect(result).to.eventually.satisfy(isUndefined);
          });
        });

        describe('when called with a parameter that matches an element', () => {
          beforeEach(() => {
            result = method.callFunction({}, {}, [createStringValue('I have a ham radio')]);
          });

          it('returns a boolean', () => {
            result.then(value => {
              expect(value.type).to.equal(valueTypes.BOOLEAN);
            });
          });

          it('returns true', () => {
            result.then(value => {
              expect(value.asNativeBoolean()).to.be.true;
            });
          });
        });

        describe('when called with a parameter that does not match an element', () => {
          beforeEach(() => {
            result = method.callFunction({}, {}, [createStringValue('not there')]);
          });

          it('returns a boolean', () => {
            result.then(value => {
              expect(value.type).to.equal(valueTypes.BOOLEAN);
            });
          });

          it('returns false', () => {
            result.then(value => {
              expect(value.asNativeBoolean()).to.be.false;
            });
          });
        });
      });

      describe('empty', () => {
        beforeEach(() => {
          value = emptyArray();
          method = value.getProperty({}, createStringValue('includes'));
        });

        it('is a function', () => {
          expect(method.type).to.equal(valueTypes.FUNCTION);
        });

        describe('when called with no parameters', () => {
          beforeEach(() => {
            result = method.callFunction({}, {}, []);
          });

          it('returns undefined', () => {
            result.then(value => {
              expect(value.type).to.equal(valueTypes.UNDEFINED);
            });
          });
        });

        describe('when called with a parameter that does not match an element', () => {
          beforeEach(() => {
            result = method.callFunction({}, {}, [createStringValue('not there')]);
          });

          it('returns a boolean', () => {
            result.then(value => {
              expect(value.type).to.equal(valueTypes.BOOLEAN);
            });
          });

          it('returns false', () => {
            result.then(value => {
              expect(value.asNativeBoolean()).to.be.false;
            });
          });
        });
      });
    });

    describe('map', () => {
      let value;
      let method;
      let mockCallback;

      describe('non-empty', () => {
        beforeEach(() => {
          value = nonEmptyArray();
          method = value.getProperty({}, createStringValue('map'));
          mockCallback = {
            callValues: [],
            callFunction: (context, scope, parameters) => {
              mockCallback.callValues.push(parameters);
              return createBooleanValue(true);
            }
          };
        });

        it('is a function', () => {
          expect(method.type).to.equal(valueTypes.FUNCTION);
        });

        it('calls the callback once for each element', () => {
          method.callFunction({}, {}, [mockCallback]).then(() => {
            expect(mockCallback.callValues.length).to.equal(3);
          });
        });

        describe('calling callback for each element', () => {
          const firstParameterForCall = (array, call) => array[call][0].asNativeValue();
          let result;

          beforeEach(() => {
            result = method.callFunction({}, {}, [mockCallback]);
          });

          it('calls with the first element', () => {
            result.then(() => {
              expect(firstParameterForCall(mockCallback.callValues, 0)).to.equal('I have a ham radio');
            });
          });

          it('calls with the second element', () => {
            result.then(() => {
              expect(firstParameterForCall(mockCallback.callValues, 1)).to.equal(12);
            });
          });

          it('calls with the third element', () => {
            result.then(() => {
              expect(firstParameterForCall(mockCallback.callValues, 2)).to.equal(false);
            });
          });
        });

        describe('returning', () => {
          let result;

          beforeEach(() => {
            mockCallback = {
              callCount: 0,
              callFunction: (context, scope) => {
                const result = mockCallback.callCount;
                mockCallback.callCount += 1;
                return createNumericValue(result);
              }
            };
            result = method.callFunction({}, {}, [mockCallback]);
          });

          it('returns an array', () => {
            result.then(value => {
              expect(value.type).to.equal(valueTypes.ARRAY);
            });
          });

          it('returns an array built with the results of the callback calls', () => {
            result.then(value => {
              expect(value.asNativeArray()).to.eql([0, 1, 2]);
            });
          });
        });
      });

      describe('empty', () => {
        beforeEach(() => {
          value = emptyArray();
          method = value.getProperty({}, createStringValue('map'));
          mockCallback = {
            callValues: [],
            callFunction: (context, scope, parameters) => {
              mockCallback.callValues.push(parameters);
              return createBooleanValue(true);
            }
          };
        });

        it('is a function', () => {
          expect(method.type).to.equal(valueTypes.FUNCTION);
        });

        it('does not call the callback', () => {
          method.callFunction({}, {}, [mockCallback]);
          expect(mockCallback.callValues.length).to.equal(0);
        });

        describe('returning', () => {
          let result;

          beforeEach(() => {
            mockCallback = {};
            result = method.callFunction({}, {}, [mockCallback]);
          });

          it('returns an array', () => {
            result.then(value => {
              expect(value.type).to.equal(valueTypes.ARRAY);
            });
          });

          it('returns an empty array', () => {
            result.then(value => {
              expect(value.asNativeArray().length).to.equal(0);
            });
          });
        });
      });
    });

    describe('reduce', () => {
      let value;
      let method;
      let mockCallback;

      describe('non-empty', () => {
        beforeEach(() => {
          value = nonEmptyArray();
          method = value.getProperty({}, createStringValue('reduce'));
          mockCallback = {
            callValues: [],
            callFunction: (context, scope, parameters) => {
              mockCallback.callValues.push(parameters);
              return parameters[1];
            }
          };
        });

        it('is a function', () => {
          expect(method.type).to.equal(valueTypes.FUNCTION);
        });

        it('calls the callback once for each element', () => {
          method.callFunction({}, {}, [mockCallback]).then(() => {
            expect(mockCallback.callValues.length).to.equal(3);
          });
        });

        describe('calling callback for each element', () => {
          const firstParameterForCall = (array, call) => array[call][0].asNativeValue();
          const secondParameterForCall = (array, call) => array[call][1].asNativeValue();
          let result;

          beforeEach(() => {
            result = method.callFunction({}, {}, [mockCallback, createStringValue('first')]);
          });

          it('calls with the initial value and first element', () => {
            result.then(() => {
              expect(firstParameterForCall(mockCallback.callValues, 0)).to.equal('first');
              expect(secondParameterForCall(mockCallback.callValues, 0)).to.equal('I have a ham radio');
            });
          });

          it('calls with the first element and second element', () => {
            result.then(() => {
              expect(firstParameterForCall(mockCallback.callValues, 1)).to.equal('I have a ham radio');
              expect(secondParameterForCall(mockCallback.callValues, 1)).to.equal(12);
            });
          });

          it('calls with the second element and third element', () => {
            result.then(() => {
              expect(firstParameterForCall(mockCallback.callValues, 2)).to.equal(12);
              expect(secondParameterForCall(mockCallback.callValues, 2)).to.equal(false);
            });
          });
        });

        describe('returning', () => {
          let result;

          beforeEach(() => {
            result = method.callFunction({}, {}, [mockCallback, createUndefined()]);
          });

          it('returns a boolean', () => {
            result.then(value => {
              expect(value.type).to.equal(valueTypes.BOOLEAN);
            });
          });

          it('returns the last value', async () => {
            result.then(value => {
              expect(value.asNativeBoolean()).to.equal(false);
            });
          });
        });
      });

      describe('empty', () => {
        beforeEach(() => {
          value = emptyArray();
          method = value.getProperty({}, createStringValue('reduce'));
          mockCallback = {
            callValues: [],
            callFunction: (context, scope, parameters) => {
              mockCallback.callValues.push(parameters);
              return parameters[1];
            }
          };
        });

        it('is a function', () => {
          expect(method.type).to.equal(valueTypes.FUNCTION);
        });

        it('never calls the callback', () => {
          method.callFunction({}, {}, [mockCallback, createStringValue('initial value')]);
          expect(mockCallback.callValues.length).to.equal(0);
        });

        describe('returning', () => {
          let result;

          beforeEach(() => {
            result = method.callFunction({}, {}, [mockCallback, createStringValue('initial value')]);
          });

          it('returns a string', () => {
            result.then(value => {
              expect(value.type).to.equal(valueTypes.STRING);
            });
          });

          it('returns the initial value', () => {
            result.then(value => {
              expect(value.asNativeString()).to.equal('initial value');
            });
          });
        });
      });
    });

    describe('filter', () => {
      let value;
      let method;
      let mockCallback;

      describe('non-empty', () => {
        beforeEach(() => {
          value = nonEmptyArray();
          method = value.getProperty({}, createStringValue('filter'));
          mockCallback = {
            callValues: [],
            callFunction: (context, scope, parameters) => {
              mockCallback.callValues.push(parameters);
              return createBooleanValue(true);
            }
          };
        });

        it('is a function', () => {
          expect(method.type).to.equal(valueTypes.FUNCTION);
        });

        it('calls the callback once for each element', () => {
          method.callFunction({}, {}, [mockCallback]).then(() => {
            expect(mockCallback.callValues.length).to.equal(3);
          });
        });

        describe('calling callback for each element', () => {
          const firstParameterForCall = (array, call) => array[call][0].asNativeValue();
          let result;

          beforeEach(() => {
            result = method.callFunction({}, {}, [mockCallback]);
          });

          it('calls with the first element', () => {
            result.then(() => {
              expect(firstParameterForCall(mockCallback.callValues, 0)).to.equal('I have a ham radio');
            });
          });

          it('calls with the second element', () => {
            result.then(() => {
              expect(firstParameterForCall(mockCallback.callValues, 1)).to.equal(12);
            });
          });

          it('calls with the third element', () => {
            result.then(() => {
              expect(firstParameterForCall(mockCallback.callValues, 2)).to.equal(false);
            });
          });
        });

        describe('returning', () => {
          let result;

          beforeEach(() => {
            mockCallback = {
              callFunction: (context, scope, parameters) => {
                return createBooleanValue(parameters[0].asNativeString() === 'I have a ham radio');
              }
            };
            result = method.callFunction({}, {}, [mockCallback]);
          });

          it('returns an array', () => {
            result.then(value => {
              expect(value.type).to.equal(valueTypes.ARRAY);
            });
          });

          it('returns an array built with the results of the callback calls', () => {
            result.then(value => {
              expect(value.asNativeArray()).to.eql(['I have a ham radio']);
            });
          });
        });
      });

      describe('empty', () => {
        beforeEach(() => {
          value = emptyArray();
          method = value.getProperty({}, createStringValue('map'));
          mockCallback = {
            callValues: [],
            callFunction: (context, scope, parameters) => {
              mockCallback.callValues.push(parameters);
              return createBooleanValue(true);
            }
          };
        });

        it('is a function', () => {
          expect(method.type).to.equal(valueTypes.FUNCTION);
        });

        it('does not call the callback', () => {
          method.callFunction({}, {}, [mockCallback]);
          expect(mockCallback.callValues.length).to.equal(0);
        });

        describe('returning', () => {
          let result;

          beforeEach(() => {
            mockCallback = {};
            result = method.callFunction({}, {}, [mockCallback]);
          });

          it('returns an array', () => {
            result.then(value => {
              expect(value.type).to.equal(valueTypes.ARRAY);
            });
          });

          it('returns an empty array', () => {
            result.then(value => {
              expect(value.asNativeArray().length).to.equal(0);
            });
          });
        });
      });
    });
  });
});
