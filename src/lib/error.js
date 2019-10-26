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

const locationToString = (location, i) => `[${i + 1}] ${location.path} (line ${location.line} column ${location.column})`;

export class TablescriptError extends Error {
  constructor(name, message, context) {
    super(message);
    this.name = name;
    this.message = message;
    this.context = context;
    Object.setPrototypeOf(this, TablescriptError.prototype);
  }

  toString() {
    if (this.context) {
      return `${this.name}: ${this.message} at:\n${this.stackTraceToString()}`;
    }
    return `${this.name}: ${this.message}`;
  }

  stackTraceToString() {
    if (this.context) {
      return this.context.locations().map(locationToString).join('\n');
    }
    return '';
  }
}

TablescriptError.fromParserError = (e, filePath) => new TablescriptError(
  'SyntaxError',
  e.message,
  {
    locations: () => [
      {
        path: filePath,
        line: e.location ? e.location.start.line : 0,
        column: e.location ? e.location.start.column: 0,
        location: e.location,
      },
    ],
  },
);

export const throwRuntimeError = (message, context) => {
  throw new TablescriptError('RuntimeError', message, context);
};

export const runtimeErrorThrower = message => context => {
  throwRuntimeError(message, context);
};
