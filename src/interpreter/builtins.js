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
import { valueTypes } from './types';
import { createStringValue } from './string';
import { findAndParseFile } from '../parser/parser';
import { interpret } from './interpreter';

const printBuiltin = {
  type: valueTypes.FUNCTION,
  callFunction: (context, scope, parameters) => {
    const output = parameters.map(p => p.asNativeString(context)).join();
    console.log(output);
    return createStringValue(output);
  },
  asString: () => 'builtin(print)',
};

const createRequireBuiltin = () => {
  return {
    type: valueTypes.FUNCTION,
    callFunction: (context, scope, parameters) => {
      const filename = parameters[0].asNativeString(context);
      const ast = findAndParseFile(context, filename);
      if (ast) {
        return interpret(ast);
      }
      throwRuntimeError(`require() file not found (${filename})`, context);
    },
    asString: () => 'builtin(require)',
  };
};

export const initializeBuiltins = interpreter => ({
  print: printBuiltin,
  require: createRequireBuiltin(interpreter),
});
