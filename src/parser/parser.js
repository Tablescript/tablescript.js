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

import Tracer from 'pegjs-backtrace';

import parser from './peg-parser';
import { TablescriptError } from '../error';

export const parse = (filePath, program) => {
  const tracer = new Tracer(program);
  try {
    return parser.parse(program, { tracer, path: filePath });
  } catch (e) {
    throw new TablescriptError(
      e.name,
      e.message,
      {
        path: filePath,
        line: e.location ? e.location.start.line : 0,
        column: e.location ? e.location.start.column: 0,
      },
      tracer.getBacktraceString()
    );
  }
};
