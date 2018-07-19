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

import nodeRepl from 'repl';
import { parse } from './parser/parser';
import { evaluateAllExpressions } from './interpreter';
import { TablescriptError } from './error';

const evaluate = (cmd, context, filename, callback) => {
  try {
    const expressions = parse(cmd, '');
    evaluateAllExpressions(expressions, context).then(value => {
      context.scope._ = value;
      callback(null, value.asNativeValue(context));
    }).catch(e => {
      e.context = undefined;
      callback(e);
    });
  } catch (e) {
    if (e instanceof TablescriptError && e.name == 'SyntaxError') {
      return callback(new nodeRepl.Recoverable(e));
    }
    return callback(e);
  }
};

export const repl = options => {
  const r = nodeRepl.start({
    prompt: '> ',
    eval: evaluate
  });
  r.defineCommand('scope', {
    help: 'Dump scope',
    action(name) {
      Object.keys(this.context.scope).forEach(key => {
        const value = this.context.scope[key].asNativeValue(this.context);
        console.log(`${key} = ${value}`);
      });
      this.displayPrompt();
    },
  });
  r.context.scope = {};
  r.context.stack = [];
  r.context.options = options;
};
