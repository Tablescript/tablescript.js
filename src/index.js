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
import { interpret } from './interpreter';
import { TablescriptError, throwRuntimeError } from './error';

const loadProgram = async (resolvers, context, filename) => {
  for (let i = 0; i < resolvers.length; i++) {
    const result = await resolvers[i](context, filename);
    if (result) {
      return result;
    }
  }
  throwRuntimeError(`Unable to load ${filename}`, context);
};

const run = async (context, filename, args, options) => {
  const program = await loadProgram(options.input.resolvers, context, filename);
  return await runProgram(context, program, args, options);
};

const runProgram = async (context, program, args, options) => {
  const ast = parse(context.path, program);
  return await interpret(ast, args, options);
}

export {
  run,
  runProgram,
  TablescriptError
}
