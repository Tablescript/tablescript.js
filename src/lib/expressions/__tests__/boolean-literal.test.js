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
import { createBooleanLiteral } from '../boolean-literal';
import { initializeContext } from '../../context';
import defaultValueFactory from '../../value-factory';
import '../../__tests__/matchers';

describe('createBooleanValue', () => {
  let mockContext;

  beforeEach(() => {
    mockContext = initializeContext({}, {}, defaultValueFactory);
  });

  describe('evaluate', () => {
    it('true literal becomes true value', () => {
      const expression = createBooleanLiteral(true);
      expect(expression.evaluate(mockContext)).toEqualTsBoolean(true);
    });

    it('evaluates a false literal to a false boolean value', () => {
      const expression = createBooleanLiteral(false);
      expect(expression.evaluate(mockContext)).toEqualTsBoolean(false);
    });
  });

  it('throws when evaluated as a lhs', () => {
    const expression = createBooleanLiteral(true);
    expect(() => expression.evaluateAsLeftHandSide()).toThrow('Cannot assign to boolean expression');
  });
});
