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

import '@babel/polyfill';
import options from 'commander';
import fs from 'fs';
import { runScript, initializeContext, defaultInitializeScope, defaultInterpreterOptions, defaultValueFactory } from '../index';
import { repl } from '../repl';
import { TablescriptError } from '../error';
import pkginfo from 'pkginfo';

pkginfo(module, 'version');

options
  .version(`Tablescript v${module.exports.version}`)
  .usage('[options] <file> [...args]')
  .option('-p, --print-last-value', 'Print the last evaluated value')
  .option('-v, --no-table-validation', 'Disable table entry validation')
  .parse(process.argv);

const interpreterOptions = defaultInterpreterOptions(options);

const filename = options.args[0];
const args = options.args.slice(1);

const context = initializeContext(
  defaultInitializeScope,
  args,
  interpreterOptions,
  defaultValueFactory,
);

if (!filename) {
  repl(context);
} else {
  try {
    const script = fs.readFileSync(filename, 'utf8');
    const value = runScript(context, script, filename);
    if (options.printLastValue) {
      console.log(value.asNativeValue());
    }
  } catch (e) {
    if (e instanceof TablescriptError) {
      console.log(e.toString());
    } else {
      console.log(e);
    }
  }
}
