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
import optionParser from './options';
import { initializeTablescript, TablescriptError } from '../lib';
import repl from './repl';

const options = optionParser.parse(process.argv);

const optionOr = (option, defaultValue) => R.isNil(option) ? defaultValue : option;

const tablescript = initializeTablescript({
  validateTables: optionOr(options.tsOptions.validateTables, true),
  evaluateCallableResult: optionOr(options.tsOptions.evaluateCallableResult, false),
  maximumLoopCount: optionOr(options.tsOptions.maxLoopCount, undefined),
  maximumStackDepth: optionOr(options.tsOptions.maxStackDepth, undefined),
  debug: optionOr(options.tsOptions.debug, false),
  locale: optionOr(options.tsOptions.locale, undefined),
  localeNumeric: optionOr(options.tsOptions.localeNumeric, undefined),
  localeSensitivity: optionOr(options.tsOptions.localeSensitivity, undefined),
});


if (R.isNil(options.filename)) {
  repl(tablescript);
} else {
  try {
    const value = tablescript.runScriptFromFile(options.filename, options.scriptArgs);
    if (options.tsOptions.printLastValue) {
      console.log(value.asNativeValue());
    }
  } catch (e) {
    if (e instanceof TablescriptError) {
      console.log(e.toString());
      process.exit(e.exitCode);
    } else {
      if (options.tsOptions.debug) {
        console.log(e);
      } else {
        console.log(`Internal Error: ${ e.toString() }`);
      }
    }
    process.exit(-1);
  }
}
