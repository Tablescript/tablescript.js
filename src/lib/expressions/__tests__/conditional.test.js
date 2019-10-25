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
import { createNumericValue } from '../../values/numeric';
import { createBooleanValue } from '../../values/boolean';
import { createConditionalExpression } from '../conditional';
import { numericValue } from '../../__tests__/util';
import { initializeContext } from '../../context';
import defaultValueFactory from '../../value-factory';
import { createNumberLiteral } from '../number-literal';
import { createBooleanLiteral } from '../boolean-literal';
import '../../__tests__/matchers';
import { createStringLiteral } from '../string-literal';

describe('createConditionalExpression', () => {
  let mockContext;

  beforeEach(() => {
    mockContext = initializeContext({}, {}, defaultValueFactory);
  });

  describe('evaluate', () => {
    it('returns the consequent value when test expression is true', () => {
      const expression = createConditionalExpression({}, createBooleanLiteral(true), createNumberLiteral(9), undefined);
      expect(expression.evaluate(mockContext)).toEqualTsNumber(9);
    });

    it('returns the alternate value when test expression is true', () => {
      const expression = createConditionalExpression({}, createBooleanLiteral(false), undefined, createStringLiteral('Sooper'));
      expect(expression.evaluate(mockContext)).toEqualTsString('Sooper');
    });
  });

  it('throws when evaluated as a lhs', () => {
    const expression = createConditionalExpression({}, {}, {}, {});
    expect(() => expression.evaluateAsLeftHandSide()).toThrow('Cannot assign to conditional expression');
  });
});
