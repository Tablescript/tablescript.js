#!/usr/bin/env node

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

import '@babel/polyfill';
import * as R from 'ramda';
import options from 'commander';
import pkginfo from 'pkginfo';
import { initializeTablescript, TablescriptError } from '../lib';
import repl from './repl';

pkginfo(module, 'version');

options
  .version(`Tablescript v${module.exports.version}`)
  .usage('[options] <file> [...args]')
  .option('-p, --print-last-value', 'Print the last evaluated value')
  .option('-V, --no-validate-tables', 'Disable table entry validation')
  .option('-c, --evaluate-callable-result', 'Evaluate callable results')
  .option('-l, --max-loop-count <count>', 'Maximum loop count')
  .option('-s, --max-stack-depth <count>', 'Maximum stack depth')
  .parse(process.argv);

const filename = options.args[0];
const args = options.args.slice(1);

const optionOr = (option, defaultValue) => R.isNil(option) ? defaultValue : option;

const tablescript = initializeTablescript({
  validateTables: optionOr(options.validateTables, true),
  evaluateCallableResult: optionOr(options.evaluateCallableResult, false),
  maximumLoopCount: optionOr(options.maxLoopCount, undefined),
  maximumStackDepth: optionOr(options.maxStackDepth, undefined),
});

if (!filename) {
  repl(tablescript);
} else {
  try {
    const value = tablescript.runScriptFromFile(filename, args);
    if (options.printLastValue) {
      console.log(value.asNativeValue());
    }
  } catch (e) {
    if (e instanceof TablescriptError) {
      console.log(e.toString());
    } else {
      console.log(`Internal Error: ${ e.toString() }`);
    }
  }
}
