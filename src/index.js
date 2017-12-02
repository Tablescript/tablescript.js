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
import { parseFile } from './parser/parser';
import { Interpreter } from './interpreter/interpreter';
import { TablescriptError } from './error';

options
  .version('0.0.1')
  .usage('[options] <file ...>')
  .option('-d, --dump-ast', 'Dump AST and terminate')
  .parse(process.argv);

options.args.map(filename => {
  let ast;
  try {
    ast = parseFile(filename);
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

  if (options.dumpAst) {
    console.log(JSON.stringify(ast.map(e => e.json())));
    process.exit(1);
  }

  try {
    const interpreter = new Interpreter();
    interpreter.execute(ast);
  } catch (e) {
    if (e instanceof TablescriptError) {
      console.log(e.toString());
    } else {
      console.log(e);
    }
    process.exit(1);
  }
});
