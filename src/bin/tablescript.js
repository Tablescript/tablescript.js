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
import { runProgram } from '../index';
import { loadFsFile } from '../fs-loader';
import { loadHttpFile } from '../http-loader';
import { TablescriptError } from '../error';

options
  .version('0.0.1')
  .usage('[options] <file> [...args]')
  .option('-p, --print-last-value', 'Print the last evaluated value')
  .parse(process.argv);

const filename = options.args[0];
const args = options.args.slice(1);

const interpreterOptions = {
  input: {
    loaders: [loadFsFile, loadHttpFile],
  },
  output: {
    print: s => {
      console.log(s);
    },
  },
};

try {
  const context = {
    path: filename,
    line: 0,
    column: 0,
  };
  const program = fs.readFileSync(filename, 'utf8');
  runProgram(context, program, args, interpreterOptions).then(value => {
    if (options.printLastValue) {
      console.log(value.asNativeValue(context));
    }
  }).catch(e => {
    if (e instanceof TablescriptError) {
      console.log(e.toString());
      console.log(e.stack);
      if (e.trace) {
        console.log(e.trace);
      }
    } else {
      console.log(e);
    }
    process.exit(1);
  });
} catch (e) {
  console.log(`RuntimeError: Unable to read ${filename}`);
}
