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

import * as R from 'ramda';
import { isArraySpread, isObjectSpread, isTableSpread } from '../values';
import { throwRuntimeError } from '../error';
import { createExpression } from './default';
import { expressionTypes } from './types';
import { withSetLocation } from './util/context';

const valueToEntries = context => (entries, value) => {
  const v = value.evaluate(context);
  if (isObjectSpread(v)) {
    throwRuntimeError('Cannot spread object into array', context);
  }
  if (isTableSpread(v)) {
    throwRuntimeError('Cannot spread table into array', context);
  }
  if (isArraySpread(v)) {
    return [
      ...entries,
      ...v.asArray(),
    ];
  }
  return [
    ...entries,
    v,
  ];
};

const evaluate = values => context => R.compose(
  context.factory.createArrayValue,
  R.reduce(valueToEntries(context), []),
)(values);

export const createArrayLiteral = (location, values) => createExpression(
  expressionTypes.ARRAY,
  withSetLocation(location, evaluate(values)),
);
