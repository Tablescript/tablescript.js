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

import { throwRuntimeError } from '../error';

export const createCallExpression = (context, callee, parameters) => {
  const evaluateParameters = async (parameters, scope) => {
    let result = []
    for (let i = 0; i < parameters.length; i++) {
      result = [
        ...result,
        await parameters[i].evaluate(scope)
      ];
    }
    return result;
  };

  const evaluate = async scope => {
    const calleeValue = await callee.evaluate(scope);
    const parameterValues = await evaluateParameters(parameters, scope);
    return await calleeValue.callFunction(context, parameterValues);
  };

  return {
    evaluate,
    evaluateAsLeftHandSide: () => {
      throwRuntimeError('Cannot assign to call expression', context);
    }
  };
};
