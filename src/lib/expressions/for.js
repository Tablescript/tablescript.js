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
import { createExpression } from './default';
import { expressionTypes } from './types';
import { isArray } from '../values';
import { withSetLocation } from './util/context';
import { throwRuntimeError } from '../error';

const evaluateLoopIteration = (identifier, loopBlock, context) => (_, item) => {
  context.pushScope({
    [identifier]: item,
  });
  const result = loopBlock.evaluate(context);
  context.popScope();
  return result;
};

const evaluate = (identifier, collection, loopBlock) => context => {
  const items = collection.evaluate(context);
  if (!isArray(items)) {
    throwRuntimeError('Cannot loop over a non-array', context);
  }
  return R.reduce(evaluateLoopIteration(identifier, loopBlock, context), context.factory.createUndefined(), items.asArray());
};

export const createForExpression = (
  location,
  identifier,
  collection,
  loopBlock
) => createExpression(
  expressionTypes.FOR,
  withSetLocation(location, evaluate(identifier, collection, loopBlock)),
);
