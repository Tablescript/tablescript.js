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

import options from 'commander';
import { parseFile } from '../parser/parser';
import { interpret } from '../interpreter/interpreter';
import { TablescriptError } from '../error';

options
  .version('0.0.1')
  .usage('[options] <file> [...args]')
  .option('-p, --print-last-value', 'Print the last evaluated value')
  .parse(process.argv);

const filename = options.args[0];
const args = options.args.slice(1);

try {
  const statements = parseFile(filename);
  const value = interpret(statements, args, {
    output: {
      print: s => {
        console.log(s);
      }
    }
  });
  if (options.printLastValue) {
    console.log(value.asNativeString({}));
  }
} catch (e) {
  if (e instanceof TablescriptError) {
    console.log(e.toString());
    if (e.trace) {
      console.log(e.trace);
    }
  } else {
    console.log(e);
  }
  process.exit(1);
}
