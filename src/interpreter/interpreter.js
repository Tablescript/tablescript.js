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

import { initializeBuiltins } from './builtins';
import { createUndefined } from './undefined';
import { createStringValue } from './string';
import { createArrayValue } from './array';
import { createObjectValue } from './object';

const expandArguments = args => ({
  arguments: createArrayValue(args.map(a => (typeof a === 'string') ? createStringValue(a) : a))
});

const initializeScope = (args, options) => ({
  system: createObjectValue({
    ...expandArguments(args),
    ...initializeBuiltins(options)
  })
});

const evaluateStatements = async (statements, scope) => {
  let value;
  for (let i = 0; i < statements.length; i++) {
    value = await statements[i].evaluate(scope);
  }
  return value;
}

export const interpret = async (statements, args, options) => {
  const scope = initializeScope(args, options);
  return await evaluateStatements(statements, scope);
};