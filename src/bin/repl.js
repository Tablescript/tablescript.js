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

import * as R from 'ramda';
import nodeRepl from 'repl';
import { TablescriptError } from '../lib';

const resetTsContext = R.curry((tablescript, replContext) => {
  replContext.tsContext = tablescript.createContext();
});

const evaluate = tablescript => (cmd, replContext, filename, callback) => {
  try {
    const value = tablescript.parseAndEvaluate(replContext.tsContext, cmd, '');
    replContext.tsContext.setVariable('_', value);
    callback(null, value.asNativeValue());
  } catch (e) {
    if (e instanceof TablescriptError && e.name == 'SyntaxError') {
      return callback(new nodeRepl.Recoverable(e));
    }
    if (e instanceof TablescriptError) {
      callback(null, e.toShortString());
      resetTsContext(tablescript, replContext);
      return;
    }
    resetTsContext(tablescript, replContext);
    return callback(e);
  }
};

const addScopeCommand = r => {
  r.defineCommand('scope', {
    help: 'Dump scope',
    action(name) {
      Object.keys(this.context.tsContext.getScope()).forEach(key => {
        const value = this.context.tsContext.getVariable(key).asNativeValue();
        console.log(`${key} = ${value}`);
      });
      this.displayPrompt();
    },
  });
};

const repl = tablescript => {
  const r = nodeRepl.start({
    prompt: '> ',
    eval: evaluate(tablescript)
  });
  resetTsContext(tablescript, r.context);
  addScopeCommand(r);
  r.on('reset', resetTsContext(tablescript));
};

export default repl;
