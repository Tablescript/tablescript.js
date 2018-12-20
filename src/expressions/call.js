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

const mergeValues = previousParameters => value => isArraySpread(value)
  ? [
      ...previousParameters,
      ...value.asArray(),
    ]
  : [
      ...previousParameters,
      value,
    ];

const evaluateParameter = (context, parameter) => previousParameters => parameter.evaluate(context).then(mergeValues(previousParameters));

const parameterReducer = context => (acc, parameter) => acc.then(evaluateParameter(context, parameter));

const evaluateParameters = async (context, parameters) => parameters.reduce(parameterReducer(context), Promise.resolve([]));

const evaluate = (location, callee, parameters) => async context => {
  context.setLocation(location);
  const calleeValue = await callee.evaluate(context);
  const evaluatedParameters = await evaluateParameters(context, parameters);
  return calleeValue.callFunction(context, evaluatedParameters);
};

export const createCallExpression = (location, callee, parameters) => createExpression(expressionTypes.CALL, evaluate(location, callee, parameters));
