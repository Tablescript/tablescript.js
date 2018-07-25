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
import { updateStack } from '../context';

const evaluator = context => (p, entry) => {
  return p.then(acc => new Promise((resolve, reject) => {
    entry.evaluate(context).then(value => {
      resolve({
        ...acc,
        ...value.asObject(),
      });
    }).catch(e => {
      reject(e);
    });
  }));
};

const evaluate = (location, entries) => async context => {
  const localContext = updateStack(context, location);
  return createObjectValue(await entries.reduce(evaluator(localContext), Promise.resolve({})));
};

export const createObjectLiteral = (location, entries) => createExpression(expressionTypes.OBJECT, evaluate(location, entries));

const evaluateObjectProperty = (key, value) => async context => createObjectValue({
  [key]: await value.evaluate(context),
});

export const createObjectLiteralPropertyExpression = (key, value) => createExpression(expressionTypes.OBJECT_PROPERTY, evaluateObjectProperty(key, value));
