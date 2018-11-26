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

import { createBooleanLiteral } from '../boolean-literal';

describe('createBooleanValue', () => {
  describe('evaluate', () => {
    let mockContext;

    beforeEach(() => {      
      mockContext = {
        factory: {
          createBooleanValue: b => b
        }
      }
    });

    it('evaluates a true literal to a true boolean value', () => {
      const expression = createBooleanLiteral(true);
      return expression.evaluate(mockContext).then(v => {
        expect(v).to.equal(true);
      });
    });

    it('evaluates a false literal to a false boolean value', () => {
      const expression = createBooleanLiteral(false);
      return expression.evaluate(mockContext).then(v => {
        expect(v).to.equal(false);
      });
    });
  });

  it('throws when evaluated as a lhs', () => {
    const expression = createBooleanLiteral(true);
    expect(() => expression.evaluateAsLeftHandSide()).to.throw('Cannot assign to boolean expression');
  });
});
