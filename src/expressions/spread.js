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
import { createExpression } from './default';
import { expressionTypes } from './types';
import { valueTypes } from '../values/types';
import { createArraySpread, createObjectSpread, createTableSpread } from '../values/spread';

const evaluate = (context, expression) => async (scope, options) => {
  const value = await expression.evaluate(scope, options);
  if (value.type === valueTypes.ARRAY) {
    return createArraySpread(value);
  }
  if (value.type === valueTypes.OBJECT) {
    return createObjectSpread(value);
  }
  if (value.type === valueTypes.TABLE) {
    return createTableSpread(value);
  }
  throwRuntimeError('Spreads only apply to ARRAY, OBJECT, and TABLE', context);
};

export const createSpreadExpression = (context, expression) => createExpression(expressionTypes.SPREAD, evaluate(context, expression));
