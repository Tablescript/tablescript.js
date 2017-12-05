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
import { createUndefined } from './undefined';
import { createArrayValue } from './array';
import { run } from '../index';
import { interpret } from './interpreter';

const assertBuiltin = options => {
  return {
    type: valueTypes.FUNCTION,
    callFunction: async (context, scope, parameters) => {
      if (parameters.length < 1) {
        throwRuntimeError(`assert(condition, [message]) takes 1 or 2 parameters`, context);
      }
      if (!parameters[0].asNativeBoolean(context)) {
        if (parameters.length === 2) {
          const message = parameters[1].asNativeString(context);
          throwRuntimeError(`assertion failed: ${message}`, context);
        } else {
          throwRuntimeError('assertion failed', context);
        }
      }
      return createUndefined();
    },
    asString: () => 'buildin(assert)',
  };
};

const printBuiltin = options => {
  return {
    type: valueTypes.FUNCTION,
    callFunction: async (context, scope, parameters) => {
      const s = parameters.map(p => p.asNativeString(context)).join();
      await options.output.print(s);
      return createStringValue(s);
    },
    asString: () => 'builtin(print)',
  };
};

const createRequireBuiltin = options => {
  return {
    type: valueTypes.FUNCTION,
    callFunction: async (context, scope, parameters) => {
      if (parameters.length < 1) {
        throwRuntimeError(`require(modulePath, ...) requires a modulePath`, context);
      }
      const filename = parameters[0].asNativeString(context);
      const args = parameters.slice(1);
      return await run(context, filename, args, options);
    },
    asString: () => 'builtin(require)',
  };
};

const keysBuiltin = {
  type: valueTypes.FUNCTION,
  callFunction: (context, scope, parameters) => {
    if (parameters.length != 1) {
      throwRuntimeError(`keys(object) takes a single object parameter`);
    }
    const object = parameters[0].asObject();
    const keys = Object.keys(object)
    keys.sort();
    return createArrayValue(keys.map(key => createStringValue(key)));
  },
  asString: () => 'builtin(keys)',
};

export const initializeBuiltins = options => ({
  assert: assertBuiltin(options),
  keys: keysBuiltin,
  print: printBuiltin(options),
  require: createRequireBuiltin(options),
});
