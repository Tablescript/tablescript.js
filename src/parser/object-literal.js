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

import { createObjectValue } from '../interpreter/object';
import { defaultExpression } from './default-expression';
import { expressionTypes } from './expression-types';

export const createObjectLiteral = (context, entries) => {

  const evaluate = async scope => {
    let result = {};
    for (let i = 0; i < entries.length; i++) {
      const value = await entries[i].evaluate(scope);
      result = {
        ...result,
        ...value.asObject(),
      };
    }
    return createObjectValue(result);
  };

  const getReferencedSymbols = () => entries.reduce((result, e) => [...result, e.getReferencedSymbols()], []);

  return {
    ...defaultExpression(expressionTypes.OBJECT, evaluate, getReferencedSymbols),
  };
};

export const createObjectLiteralPropertyExpression = (context, key, value) => {

  const evaluate = async scope => createObjectValue({
    [key]: await value.evaluate(scope),
  });

  const getReferencedSymbols = () => value.getReferencedSymbols();

  return {
    ...defaultExpression(expressionTypes.OBJECT_PROPERTY, evaluate, getReferencedSymbols),
  };
};
