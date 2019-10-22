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

import { initializeContext } from './context';
import { runScript, loadAndRunScript } from './runner';
import { initializeBuiltins } from './values/builtins/builtins';
import { loadFsFile } from './fs-loader';
import { createArrayValue } from './values/array';
import { createBooleanValue } from './values/boolean';
import { createNumericValue } from './values/numeric';
import { createObjectValue } from './values/object';
import { createStringValue } from './values/string';
import { createTableValue } from './values/table';
import { createUndefined } from './values/undefined';

const defaultInterpreterOptions = options => ({
  input: {
    loaders: [loadFsFile],
  },
  output: {
    print: s => {
      console.log(s);
    },
  },
  flags: {
    validateTables: options.tableValidation || true,
  }
});

const expandArguments = args => ({
  arguments: createArrayValue(args.map(a => (typeof a === 'string') ? createStringValue(a) : a))
});

const defaultInitializeScope = (args, options) => ({
  ...expandArguments(args),
  ...initializeBuiltins(options),
});

const defaultValueFactory = {
  createArrayValue,
  createBooleanValue,
  createNumericValue,
  createObjectValue,
  createStringValue,
  createTableValue,
  createUndefined,
};

export {
  initializeContext,
  runScript,
  loadAndRunScript,
  defaultInterpreterOptions,
  defaultInitializeScope,
  defaultValueFactory,
};
