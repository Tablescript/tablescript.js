#!/usr/bin/env node

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
