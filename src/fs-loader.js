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

import fs from 'fs';
import path from 'path';

const isPathed = p => p.split('/').length > 1;
const pathFromContext = context => context.stack.length > 0 ? [path.dirname(context.stack[0].path)] : [];
const contextPath = (context, filename) => isPathed(filename) ? pathFromContext(context) : [];
const environmentPaths = () => (process.env.TS_PATH || '').split(':');

const allPaths = (context, filename) => ([
  ...contextPath(context, filename),
  ...environmentPaths()
]);

const fileContents = filePath => {
  return new Promise(resolve => {
    fs.readFile(filePath, 'utf8', (error, contents) => {
      if (error) {
        resolve(undefined);
      } else {
        resolve({ path: filePath, body: contents });
      }
    });
  });
};

const tryAllPaths = async (paths, filename) => {
  for (let i = 0; i < paths.length; i++) {
    const contents = await fileContents(path.resolve(paths[i], filename));
    if (contents) {
      return contents;
    }
  }
  return undefined;
};

export const loadFsFile = async (context, filename) => {
  return await tryAllPaths(allPaths(context, filename), filename);
};
