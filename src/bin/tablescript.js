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

import 'babel-polyfill';
import options from 'commander';
import fs from 'fs';
import { runScript } from '../index';
import { repl } from '../repl';
import { initializeContext } from '../context';
import { loadFsFile } from '../fs-loader';
import { loadHttpFile } from '../http-loader';
import { TablescriptError } from '../error';
import pkginfo from 'pkginfo';

import { initializeBuiltins } from '../builtins/builtins';
import { initializeMath } from '../builtins/math';
import { createArrayValue } from '../values/array';
import { createBooleanValue } from '../values/boolean';
import { createNumericValue } from '../values/numeric';
import { createObjectValue } from '../values/object';
import { createStringValue } from '../values/string';
import { createUndefined } from '../values/undefined';

pkginfo(module, 'version');

options
  .version(`Tablescript v${module.exports.version}`)
  .usage('[options] <file> [...args]')
  .option('-p, --print-last-value', 'Print the last evaluated value')
  .option('-v, --no-table-validation', 'Disable table entry validation')
  .parse(process.argv);

const interpreterOptions = {
  input: {
    loaders: [loadFsFile, loadHttpFile],
  },
  output: {
    print: s => {
      console.log(s);
    },
  },
  flags: {
    validateTables: options.tableValidation,
  }
};

const filename = options.args[0];
const args = options.args.slice(1);

const expandArguments = args => ({
  arguments: createArrayValue(args.map(a => (typeof a === 'string') ? createStringValue(a) : a))
});

const initializeScope = (args, options) => ({
  system: createObjectValue({
    ...expandArguments(args),
    ...initializeBuiltins(options),
  }),
  math: createObjectValue({
    ...initializeMath(),
  }),
});

const valueFactory = {
  createArrayValue,
  createBooleanValue,
  createNumericValue,
  createStringValue,
  createUndefined,
};

const context = initializeContext(
  initializeScope,
  args,
  interpreterOptions,
  valueFactory,
);

if (!filename) {
  repl(context);
} else {
  try {
    const script = fs.readFileSync(filename, 'utf8');
    runScript(context, script, filename).then(value => {
      if (options.printLastValue) {
        console.log(value.asNativeValue(context));
      }
    }).catch(e => {
      if (e instanceof TablescriptError) {
        console.log(e.toString());
      } else {
        console.log(e);
      }
      process.exit(1);
    });
  } catch (e) {
    console.log(`[RuntimeError]: Unable to read ${filename}`);
  }
}
