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

import { throwRuntimeError } from '../error';
import { defaultExpression } from './default';
import { expressionTypes } from './types';
import { valueTypes } from '../values/types';
import { createArraySpread, createObjectSpread, createTableSpread } from '../values/spread';

export const createSpreadExpression = (context, expression) => {

  const evaluate = async scope => {
    const value = await expression.evaluate(scope);
    if (value.type === valueTypes.ARRAY) {
      return createArraySpread(value);
    } else if (value.type === valueTypes.OBJECT) {
      return createObjectSpread(value);
    } else if (value.type === valueTypes.TABLE) {
      return createTableSpread(value);
    }
    throwRuntimeError('Spreads only apply to ARRAY, OBJECT, and TABLE', context);
  };

  return {
    ...defaultExpression(expressionTypes.SPREAD, evaluate),
  };
};
