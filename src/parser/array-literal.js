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

import { valueTypes } from '../interpreter/types';
import { throwRuntimeError } from '../error';
import { createArrayValue } from '../interpreter/array';
import { defaultExpression } from './default-expression';
import { expressionTypes } from './expression-types';

export const createArrayLiteral = (context, values) => {

  const evaluate = async scope => {
    let result = [];
    for (let i = 0; i < values.length; i++) {
      const value = await values[i].evaluate(scope);
      if (value.type === valueTypes.ARRAY_SPREAD) {
        result = [
          ...result,
          ...value.asArray(context)
        ];
      } else if (value.type === valueTypes.OBJECT_SPREAD) {
        throwRuntimeError('Cannot spread object into array', context);
      } else {
        result = [
          ...result,
          value
        ];
      }
    }
    return createArrayValue(result);
  };

  const getReferencedSymbols = () => values.reduce((result, value) => [...result, ...value.getReferencedSymbols()], []);

  return {
    ...defaultExpression(expressionTypes.ARRAY, evaluate, getReferencedSymbols),
  };
};

  