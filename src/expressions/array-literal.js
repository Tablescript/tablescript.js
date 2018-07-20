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

import { isArraySpread, isObjectSpread } from '../values/types';
import { throwRuntimeError } from '../error';
import { createArrayValue } from '../values/array';
import { createExpression } from './default';
import { expressionTypes } from './types';
import { updateStack } from '../context';

const evaluate = (location, values) => async context => {
  const localContext = updateStack(context, location);
  let result = [];
  for (let i = 0; i < values.length; i++) {
    const value = await values[i].evaluate(localContext);
    if (isArraySpread(value)) {
      result = [
        ...result,
        ...value.asArray(context)
      ];
    } else if (isObjectSpread(value)) {
      throwRuntimeError('Cannot spread object into array', localContext);
    } else {
      result = [
        ...result,
        value
      ];
    }
  }
  return createArrayValue(result);
};

export const createArrayLiteral = (location, values) => createExpression(expressionTypes.ARRAY, evaluate(location, values));
