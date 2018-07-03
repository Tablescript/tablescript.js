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

import { throwRuntimeError } from '../../error';
import { run } from '../../index';

export const requireBuiltIn = options => async (context, _, parameters) => {
  if (parameters.length < 1) {
    throwRuntimeError(`require(modulePath, ...) requires a modulePath`, context);
  }
  const filename = parameters[0].asNativeString(context);
  const args = parameters.slice(1);
  return await run(context, filename, args, options);
};
