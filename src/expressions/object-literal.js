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

import { createObjectValue } from '../values/object';
import { createExpression } from './default';
import { expressionTypes } from './types';

const evaluator = scope => (p, entry) => {
  return p.then(acc => new Promise(resolve => {
    entry.evaluate(scope).then(value => {
      resolve({
        ...acc,
        ...value.asObject(),
      });
    });
  }));
};

const evaluate = entries => async scope => createObjectValue(await entries.reduce(evaluator(scope), Promise.resolve({})));

export const createObjectLiteral = entries => createExpression(expressionTypes.OBJECT, evaluate(entries));

const evaluateObjectProperty = (key, value) => async scope => createObjectValue({
  [key]: await value.evaluate(scope),
});

export const createObjectLiteralPropertyExpression = (key, value) => createExpression(expressionTypes.OBJECT_PROPERTY, evaluateObjectProperty(key, value));
