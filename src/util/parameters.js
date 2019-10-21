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
import { throwRuntimeError } from '../error';

const bindFormalParameter = (context, parameters) => (acc, formalParameter, i) => ({
  ...acc,
  [formalParameter]: parameters[i] || context.factory.createUndefined(),
});

const bindFormalParameters = (context, formalParameters, parameters) => R.addIndex(R.reduce)(bindFormalParameter(context, parameters), {}, formalParameters);

export const bindFunctionParameters = (context, formalParameters, parameters) => ({
  ...bindFormalParameters(context, formalParameters, parameters),
  'arguments': context.factory.createArrayValue(parameters),
});

export const requiredParameter = (context, name) => {
  const localVariable = context.getLocalVariable(name);
  if (localVariable) {
    return localVariable;
  }
  throwRuntimeError(`Missing required parameter "${name}"`, context);
};

export const optionalParameter = (context, name) => context.getLocalVariable(name);

export const optionalParameterOr = (context, name, value) => context.getLocalVariable(name) ? context.getLocalVariable(name) : value;
