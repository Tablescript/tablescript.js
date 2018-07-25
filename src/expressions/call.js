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

import { expressionTypes } from './types';
import { createExpression } from './default';
import { isArraySpread } from '../values/types';
import { updateStack } from '../context';

const parameterEvaluator = context => (p, parameter) => {
  return p.then(acc => new Promise((resolve, reject) => {
    parameter.evaluate(context).then(value => {
      if (isArraySpread(value)) {
        resolve([
          ...acc,
          ...value.asArray(),
        ]);
      } else {
        resolve([
          ...acc,
          value,
        ]);
      }
    }).catch(reject);
  }));
};

const evaluateParameters = async (context, parameters) => parameters.reduce(parameterEvaluator(context), Promise.resolve([]));

const evaluate = (location, callee, parameters) => async context => {
  const localContext = updateStack(context, location);
  const calleeValue = await callee.evaluate(localContext);
  const evaluatedParameters = await evaluateParameters(localContext, parameters);
  return calleeValue.callFunction(localContext, evaluatedParameters);
};

export const createCallExpression = (location, callee, parameters) => createExpression(expressionTypes.CALL, evaluate(location, callee, parameters));
