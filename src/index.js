#!/usr/bin/env node

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

const evaluateAllExpressions = async (expressions, scope, options) => {
  let value;
  for (let i = 0; i < expressions.length; i++) {
    value = await expressions[i].evaluate(scope, options);
  }
  return value;
}

export const interpret = async (ast, args, options) => {
  const scope = initializeScope(args, options);
  return await evaluateAllExpressions(ast, scope, options);
};

const runProgram = async (context, program, args, options) => {
  const expressions = parse(context.path, program);
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
  return await runProgram({ path: program.path }, program.body, args, options);
};    

export {
  run,
  runProgram,
  TablescriptError
}
