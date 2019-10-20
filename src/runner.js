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

import { parse } from './parser/tablescript-parser';
import { throwRuntimeError } from './error';

export const runScript = (context, script, scriptPath) => {
  const expression = parse(script, scriptPath);
  return expression.evaluate(context);
};

const loadScript = (context, scriptPath) => {
  for (const loader of context.options.input.loaders) {
    const script = loader(context, scriptPath);
    if (script) {
      return script;
    }
  }
  throwRuntimeError(`Unable to load "${scriptPath}"`, context);
};

export const loadAndRunScript = (context, scriptPath, args) => {
  const script = loadScript(context, scriptPath);
  return runScript(context, script.body, script.path, args);
};
