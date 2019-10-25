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
import { createNumberLiteral } from '../number-literal';
import { initializeContext } from '../../context';
import defaultValueFactory from '../../value-factory';
import '../../__tests__/matchers';

describe('createNumberLiteral', () => {
  describe('evaluate', () => {
    let mockContext;

    beforeEach(() => {      
      mockContext = initializeContext({}, {}, defaultValueFactory);
    });

    it('evaluates a number literal to an equivalent numeric value', () => {
      const expression = createNumberLiteral(12);
      expect(expression.evaluate(mockContext)).toEqualTsNumber(12);
    });
  });

  it('throws when evaluated as a lhs', () => {
    const expression = createNumberLiteral(12);
    expect(() => expression.evaluateAsLeftHandSide()).toThrow('Cannot assign to number expression');
  });
});
