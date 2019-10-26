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

import nodeRepl from 'repl';
import { TablescriptError } from '../lib';

const evaluate = tablescript => (cmd, context, filename, callback) => {
  try {
    const value = tablescript.parseAndEvaluate(context, cmd, '');
    context.setVariable('_', value);
    callback(null, value.asNativeValue());
  } catch (e) {
    if (e instanceof TablescriptError && e.name == 'SyntaxError') {
      return callback(new nodeRepl.Recoverable(e));
    }
    e.context = undefined;
    return callback(e);
  }
};

const addScopeCommand = r => {
  r.defineCommand('scope', {
    help: 'Dump scope',
    action(name) {
      Object.keys(this.context.getScope()).forEach(key => {
        const value = this.context.getVariable(key).asNativeValue(this.context);
        console.log(`${key} = ${value}`);
      });
      this.displayPrompt();
    },
  });
};

const addTablescriptContext = (r, tablescript) => {
  r.context = tablescript.createContext();
};

const repl = tablescript => {
  const r = nodeRepl.start({
    prompt: '> ',
    eval: evaluate(tablescript)
  });
  addScopeCommand(r);
  addTablescriptContext(r, tablescript);
};

export default repl;
