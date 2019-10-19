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

import { createExpression } from './default';
import { expressionTypes } from './types';

const mergeObjectEntries = context => (acc, entry) => {
  const value = entry.evaluate(context);
  return {
    ...acc,
    ...value.asObject(),
  };
};

const evaluate = (location, entries) => context => {
  context.setLocation(location);
  return context.factory.createObjectValue(entries.reduce(mergeObjectEntries(context), {}));
};

export const createObjectLiteral = (location, entries) => createExpression(expressionTypes.OBJECT, evaluate(location, entries));

const evaluateObjectProperty = (key, value) => context => context.factory.createObjectValue({
  [key]: value.evaluate(context),
});

export const createObjectLiteralPropertyExpression = (key, value) => createExpression(
  expressionTypes.OBJECT_PROPERTY,
  evaluateObjectProperty(key, value)
);

const evaluateObjectPropertyAndKey = (key, value) => context => context.factory.createObjectValue({
  [(key.evaluate(context)).asNativeString()]: value.evaluate(context),
});

export const createObjectLiteralPropertyExpressionWithEvaluatedKey = (key, value) => createExpression(
  expressionTypes.OBJECT_PROPERTY,
  evaluateObjectPropertyAndKey(key, value)
);
