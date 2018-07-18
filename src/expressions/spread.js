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
import { updateStack } from '../context';

const evaluate = (location, expression) => async context => {
  const localContext = updateStack(context, location);
  const value = await expression.evaluate(localContext);
  if (value.type === valueTypes.ARRAY) {
    return createArraySpread(value);
  }
  if (value.type === valueTypes.OBJECT) {
    return createObjectSpread(value);
  }
  if (value.type === valueTypes.TABLE) {
    return createTableSpread(value);
  }
  throwRuntimeError('Spreads only apply to ARRAY, OBJECT, and TABLE', localContext);
};

export const createSpreadExpression = (location, expression) => createExpression(expressionTypes.SPREAD, evaluate(location, expression));
