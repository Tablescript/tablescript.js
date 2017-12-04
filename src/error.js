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

export class TablescriptError {
  constructor(name, message, context, trace) {
    this.name = name;
    this.message = message;
    this.context = context;
    this.trace = trace;
  }

  toString() {
    return `${this.contextToString()}[${this.name}] ${this.message}`;
  }

  contextToString() {
    if (this.context) {
      return `${this.context.path} (line ${this.context.line} column ${this.context.column}): `;
    }
    return '';
  }
}

export const throwRuntimeError = (message, context) => {
  throw new TablescriptError('RuntimeError', message, context);
};

export const runtimeErrorThrower = message => context => {
  throwRuntimeError(message, context);
};