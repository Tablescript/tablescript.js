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

const printBuiltin = options => {
  return {
    type: valueTypes.FUNCTION,
    callFunction: (context, scope, parameters) => {
      const s = parameters.map(p => p.asNativeString(context)).join();
      options.output.print(s);
      return createStringValue(s);
    },
    asString: () => 'builtin(print)',
  };
};

const createRequireBuiltin = options => {
  return {
    type: valueTypes.FUNCTION,
    callFunction: (context, scope, parameters) => {
      if (parameters.length < 1) {
        throwRuntimeError(`require(modulePath, ...) requires a modulePath`, context);
      }
      const filename = parameters[0].asNativeString(context);
      const args = parameters.slice(1);
      const statements = findAndParseFile(context, filename);
      if (statements) {
        return interpret(statements, args, options);
      }
      throwRuntimeError(`require() file not found (${filename})`, context);
    },
    asString: () => 'builtin(require)',
  };
};

export const initializeBuiltins = options => ({
  print: printBuiltin(options),
  require: createRequireBuiltin(options),
});
