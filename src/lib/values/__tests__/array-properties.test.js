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
import {
  createNativeFunctionValue,
  nativeFunctionParameter,
  requiredNumericParameterF,
  toNumericResult,
  toNativeNumber,
  requiredParameterF,
  toBooleanResult
} from '../native-function';
import { createStringValue } from '../string';
import { createNumericValue } from '../numeric';
import { createBooleanValue } from '../boolean';
import { createArrayValue } from '../array';
import { initializeContext } from '../../context';
import defaultValueFactory from '../../value-factory';
import { numericValue, booleanValue, arrayValue } from '../../__tests__/util';
require('../../__tests__/matchers');

describe('array', () => {
  const nonEmptyArray = () => createArrayValue([createStringValue('I have a ham radio'), createNumericValue(12), createBooleanValue(false)]);
  const nonEmptyNumericArray = () => createArrayValue([createNumericValue(4), createNumericValue(5), createNumericValue(6)]);
  const emptyArray = () => createArrayValue([]);

  let mockContext;

  beforeEach(() => {
    mockContext = initializeContext({}, {}, defaultValueFactory);
  });

  describe('methods', () => {
    describe('length', () => {
      const methodName = createStringValue('length');

      it('knows the length of non-empty arrays', () => {
        const f = nonEmptyArray().getProperty({}, methodName);
        expect(f.callFunction(mockContext, [])).toEqualTsNumber(3);
      });

      it('knows the length of empty arrays', () => {
        const f = emptyArray().getProperty({}, methodName);
        expect(f.callFunction(mockContext, [])).toEqualTsNumber(0);
      });
    });

    describe('includes', () => {
      const methodName = createStringValue('includes');

      it('returns false for empty arrays', () => {
        const f = emptyArray().getProperty({}, methodName);
        expect(f.callFunction(mockContext, [createStringValue('Not gonna find it')])).toEqualTsBoolean(false);
      });

      it('returns false for non-empty arrays without a matching value', () => {
        const f = nonEmptyArray().getProperty({}, methodName);
        expect(f.callFunction(mockContext, [createStringValue('Not gonna find it')])).toEqualTsBoolean(false);
      });

      it('returns true for non-empty arrays with a matching value', () => {
        const f = nonEmptyArray().getProperty({}, methodName);
        expect(f.callFunction(mockContext, [createNumericValue(12)])).toEqualTsBoolean(true);
      });
    });

    describe('map', () => {
      const methodName = createStringValue('map');
      let callback;

      beforeEach(() => {
        callback = createNativeFunctionValue(
          'inc',
          [
            nativeFunctionParameter('n', requiredNumericParameterF(toNativeNumber))
          ],
          (context, args, n) => n + 1,
          toNumericResult
        );
      });

      describe('for an empty array', () => {
        it('returns an empty array when called on an empty array', () => {
          const f = emptyArray().getProperty({}, methodName);
          expect(f.callFunction(mockContext, [callback])).toEqualTsArray(createArrayValue([]));
        });
      });

      describe('for a non-empty array', () => {
        it('returns an array of values mapped from the original array', () => {
          const f = nonEmptyNumericArray().getProperty({}, methodName);
          expect(f.callFunction(mockContext, [callback])).toEqualTsArray(
            createArrayValue([
              createNumericValue(5),
              createNumericValue(6),
              createNumericValue(7)
            ])
          );
        });
      });
    });

    describe('reduce', () => {
      const methodName = createStringValue('reduce');
      let callback;

      beforeEach(() => {
        callback = createNativeFunctionValue(
          'max',
          [
            nativeFunctionParameter('acc', requiredParameterF(toNativeNumber)),
            nativeFunctionParameter('n', requiredParameterF(toNativeNumber)),
          ],
          (context, args, acc, n) => Math.max(acc, n),
          toNumericResult,
        );
      });

      describe('for an empty array', () => {
        it('returns the initial value when called on an empty array', () => {
          const f = emptyArray().getProperty({}, methodName);
          expect(f.callFunction(mockContext, [callback, createNumericValue(0)])).toEqualTsNumber(0);
        });
      });

      describe('for a non-empty array', () => {
        it('returns the reduced value from the original array', () => {
          const f = nonEmptyNumericArray().getProperty({}, methodName);
          expect(f.callFunction(mockContext, [callback, createNumericValue(0)])).toEqualTsNumber(6);
        });
      });
    });

    describe('filter', () => {
      const methodName = createStringValue('filter');
      let callback;

      beforeEach(() => {
        callback = createNativeFunctionValue(
          'even',
          [
            nativeFunctionParameter('n', requiredParameterF(toNativeNumber)),
          ],
          (context, args, n) => n % 2 === 0,
          toBooleanResult,
        );
      });

      describe('for an empty array', () => {
        it('returns an empty array when called on an empty array', () => {
          const f = emptyArray().getProperty({}, methodName);
          expect(f.callFunction(mockContext, [callback])).toEqualTsArray(createArrayValue([]));
        });
      });

      describe('for a non-empty array', () => {
        it('returns an array of values mapped from the original array', () => {
          const f = nonEmptyNumericArray().getProperty({}, methodName);
          expect(f.callFunction(mockContext, [callback])).toEqualTsArray(createArrayValue([createNumericValue(4), createNumericValue(6)]));
        });
      });
    });
  });
});
