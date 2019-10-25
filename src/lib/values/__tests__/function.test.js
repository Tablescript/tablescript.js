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
import { valueTypes } from '../types';
import { createNumericValue } from '../numeric';
import { createStringValue } from '../string';
import { createFunctionValue } from '../function';
import {
  createNativeFunctionValue,
  toArrayResult,
  toNumericResult,
  nativeFunctionParameter,
  optionalParameterF,
  requiredParameterF
} from '../native-function';
import { createBooleanValue } from '../boolean';
import { createArrayValue } from '../array';
import { createUndefined } from '../undefined';
import { initializeContext } from '../../context';
import defaultValueFactory from '../../value-factory';
require('../../__tests__/matchers');

describe('function', () => {
  let mockContext;

  beforeEach(() => {
    mockContext = initializeContext({}, {}, defaultValueFactory);
  });

  describe('createNativeFunctionValue', () => {
    let value;

    beforeEach(() => {
      value = createNativeFunctionValue('test', [], () => undefined);
    });

    it('has type FUNCTION', () => {
      expect(value).toBeTsFunction();
    });

    it('has native value "function(native)"', () => {
      expect(value.asNativeValue()).toEqual('function(native)');
    });

    it('throws when converted to a native number', () => {
      expect(() => value.asNativeNumber()).toThrow('Cannot treat FUNCTION as NUMBER');
    });

    it('has native string value "function(native)"', () => {
      expect(value.asNativeString()).toEqual('function(native)');
    });

    it('has native boolean value true', () => {
      expect(value.asNativeBoolean()).toEqual(true);
    });

    it('is not equal to anything', () => {
      expect(value.nativeEquals()).toBeFalsy();
    });

    it('throws when asked for a property', () => {
      expect(() => value.getProperty()).toThrow('Cannot get property of FUNCTION');
    });

    it('throws when asked to set a property', () => {
      expect(() => value.setProperty()).toThrow('Cannot set property of FUNCTION');
    });

    it('throws when asked for an element', () => {
      expect(() => value.getElement()).toThrow('Cannot get element of FUNCTION');
    });

    describe('callFunction', () => {
      describe('with no formal parameters', () => {
        it('sets the arguments variable', () => {
          const f = createNativeFunctionValue(
            'test',
            [],
            (context, args) => args,
            toArrayResult,
          );
          const params = [createStringValue('string'), createNumericValue(12), createBooleanValue(true)];
          expect(
            f.callFunction(mockContext, params)
          ).toEqualTsArray(createArrayValue(params));
        });

        it('returns the result of the call', () => {
          const f = createNativeFunctionValue(
            'test',
            [],
            (context, args) => 12,
            toNumericResult,
          );
          expect(f.callFunction(mockContext, [])).toEqualTsNumber(12);
        });
      });

      describe('with formal parameters', () => {
        it('sets the arguments variable', () => {
          const f = createNativeFunctionValue(
            'test',
            [
              nativeFunctionParameter('p1', optionalParameterF()),
              nativeFunctionParameter('p2', optionalParameterF()),
            ],
            (context, args) => args,
            toArrayResult,
          );
          const params = [createStringValue('string'), createNumericValue(12), createBooleanValue(true)];
          expect(
            f.callFunction(mockContext, params)
          ).toEqualTsArray(createArrayValue(params));
        });

        it('sets the parameters', () => {
          const f = createNativeFunctionValue(
            'test',
            [
              nativeFunctionParameter('p1', requiredParameterF()),
              nativeFunctionParameter('p2', requiredParameterF()),
            ],
            (context, args, p1, p2) => ([p1, p2]),
            toArrayResult,
          );
          const params = [createStringValue('string'), createNumericValue(12)];
          expect(f.callFunction(mockContext, params)).toEqualTsArray(createArrayValue(params));
        });

        it('does not set un-passed parameters', () => {
          const f = createNativeFunctionValue(
            'test',
            [
              nativeFunctionParameter('p1', requiredParameterF()),
              nativeFunctionParameter('p2', optionalParameterF()),
            ],
            (context, args, p1, p2) => ([p1, p2]),
            toArrayResult,
          );
          expect(f.callFunction(mockContext, [createStringValue('string')]))
            .toEqualTsArray(createArrayValue([createStringValue('string'), createUndefined()]));
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
      expect(value.type).toEqual(valueTypes.FUNCTION);
    });

    it('has native value "function(tablescript)"', () => {
      expect(value.asNativeValue()).toEqual('function(tablescript)');
    });

    it('throws when converted to a native number', () => {
      expect(() => value.asNativeNumber()).toThrow('Cannot treat FUNCTION as NUMBER');
    });

    it('has native string value "function(tablescript)"', () => {
      expect(value.asNativeString()).toEqual('function(tablescript)');
    });

    it('has native boolean value true', () => {
      expect(value.asNativeBoolean()).toEqual(true);
    });

    it('is not equal to anything', () => {
      expect(value.nativeEquals()).toBeFalsy();
    });

    it('throws when converted to number', () => {
      expect(() => value.asNativeNumber()).toThrow('Cannot treat FUNCTION as NUMBER');
    });

    it('throws when asked for a property', () => {
      expect(() => value.getProperty()).toThrow('Cannot get property of FUNCTION');
    });

    it('throws when asked to set a property', () => {
      expect(() => value.setProperty()).toThrow('Cannot set property of FUNCTION');
    });

    it('throws when asked for an element', () => {
      expect(() => value.getElement()).toThrow('Cannot get element of FUNCTION');
    });

    describe('callFunction', () => {
      describe('with no formal parameters', () => {
        it('sets the arguments variable', () => {
          const f = createFunctionValue([], { evaluate: context => context.getLocalVariable('arguments') }, {});
          expect(
            f.callFunction(mockContext, [createStringValue('string'), createNumericValue(12), createBooleanValue(true)])
          ).toEqualTsArray(createArrayValue([createStringValue('string'), createNumericValue(12), createBooleanValue(true)]));
        });

        it('sets scope from closure', () => {
          const f = createFunctionValue([], { evaluate: context => context.getVariable('fromClosure') }, { fromClosure: createNumericValue(12) });
          expect(f.callFunction(mockContext, [])).toEqualTsNumber(12);
        });

        it('overrides closure scope with parameters', () => {
          const f = createFunctionValue([], { evaluate: context => context.getVariable('arguments') }, { 'arguments': createNumericValue(12) });
          expect(f.callFunction(mockContext, [createNumericValue(13)])).toEqualTsArray(createArrayValue([createNumericValue(13)]));
        });
      });

      describe('with formal parameters', () => {
        it('sets the arguments variable', () => {
          const f = createFunctionValue(['p1', 'p2'], { evaluate: context => context.getVariable('arguments') }, {});
          const params = [createStringValue('string'), createNumericValue(12), createBooleanValue(true)];
          expect(
            f.callFunction(mockContext, params)
          ).toEqualTsArray(createArrayValue(params));
        });

        it('sets the parameters', () => {
          const f = createFunctionValue(
            ['p1', 'p2'],
            { evaluate: context => createArrayValue([context.getVariable('p1'), context.getVariable('p2')]) },
            {}
          );
          const params = [createStringValue('string'), createNumericValue(12)];
          expect(f.callFunction(mockContext, params)).toEqualTsArray(createArrayValue(params));
        });

        it('does not set un-passed parameters', () => {
          const f = createFunctionValue(
            ['p1', 'p2'],
            { evaluate: context => createArrayValue([context.getVariable('p1'), context.getVariable('p2') || createUndefined()]) },
            {}
          );
          expect(f.callFunction(mockContext, [createStringValue('string')]))
            .toEqualTsArray(createArrayValue([createStringValue('string'), createUndefined()]));
        });

        it('overrides closure scope with parameters', () => {
          const f = createFunctionValue(
            ['p1', 'p2'],
            { evaluate: context => createArrayValue([context.getVariable('p1'), context.getVariable('p2')]) },
            { p2: createStringValue('not this') }
          );
          const params = [createNumericValue(12), createNumericValue(13)];
          expect(f.callFunction(mockContext, params)).toEqualTsArray(createArrayValue(params));
        });

        it('overrides closure scope (as undefined) with un-passed parameters', () => {
          const f = createFunctionValue(
            ['p1', 'p2'],
            { evaluate: context => createArrayValue([context.getVariable('p1'), context.getVariable('p2') || createUndefined()]) },
            { p2: createStringValue('this') }
          );
          expect(f.callFunction(mockContext, [createNumericValue(12)])).toEqualTsArray(createArrayValue([createNumericValue(12), createUndefined()]));
        });
      });
    });
  });
});
