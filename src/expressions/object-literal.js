// Copyright 2019 Jamie Hale
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
import { withSetLocation } from './util/context';

const mergeObjectEntries = context => (acc, entry) => {
  const value = entry.evaluate(context);
  return {
    ...acc,
    ...value.asObject(),
  };
};

const evaluate = entries => context => context.factory.createObjectValue(entries.reduce(mergeObjectEntries(context), {}));

export const createObjectLiteral = (location, entries) => createExpression(
  expressionTypes.OBJECT,
  withSetLocation(location, evaluate(entries)),
);

const evaluateObjectProperty = (keyString, value) => context => context.factory.createObjectValue({
  [keyString]: value.evaluate(context),
});

export const createObjectLiteralPropertyExpression = (key, value) => createExpression(
  expressionTypes.OBJECT_PROPERTY,
  evaluateObjectProperty(key, value)
);

const evaluateObjectPropertyAndKey = (keyExpression, value) => context => context.factory.createObjectValue({
  [(keyExpression.evaluate(context)).asNativeString()]: value.evaluate(context),
});

export const createObjectLiteralPropertyExpressionWithEvaluatedKey = (key, value) => createExpression(
  expressionTypes.OBJECT_PROPERTY,
  evaluateObjectPropertyAndKey(key, value)
);
