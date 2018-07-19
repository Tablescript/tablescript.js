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

import { parse } from './parser/parser';
import { evaluateAllExpressions } from './interpreter';
import { TablescriptError, throwRuntimeError } from './error';
import { initializeBuiltins } from './values/builtins/builtins';
import { initializeMath } from './values/math/math';
import { createStringValue } from './values/string';
import { createArrayValue } from './values/array';
import { createObjectValue } from './values/object';

const expandArguments = args => ({
  arguments: createArrayValue(args.map(a => (typeof a === 'string') ? createStringValue(a) : a))
});

const initializeScope = (args, options) => ({
  system: createObjectValue({
    ...expandArguments(args),
    ...initializeBuiltins(options),
  }),
  math: createObjectValue({
    ...initializeMath(options),
  }),
});

export const interpret = async (expressions, args, options) => {
  const context = {
    stack: [],
    scope: initializeScope(args, options),
    options,
  };
  return await evaluateAllExpressions(expressions, context);
};

const runProgram = async (filePath, program, args, options) => {
  const expressions = parse(filePath, program);
  return await interpret(expressions, args, options);
}  

const loadProgram = async (loaders, context, filename) => {
  for (let i = 0; i < loaders.length; i++) {
    const result = await loaders[i](context, filename);
    if (result) {
      return result;
    }  
  }  
  throwRuntimeError(`Unable to load ${filename}`, context);
};  

const run = async (context, filename, args, options) => {
  const program = await loadProgram(options.input.loaders, context, filename);
  return await runProgram(program.path, program.body, args, options);
};    

export {
  run,
  runProgram,
  TablescriptError
}
