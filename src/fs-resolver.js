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
const contextPath = (context, filename) => isPathed(filename) ? [path.dirname(context.path)] : [];
const environmentPaths = () => (process.env.TS_PATH || '').split(':');

const fileContents = (filePath) => {
  return new Promise(resolve => {
    fs.readFile(filePath, 'utf8', (error, contents) => {
      if (error) {
        resolve(undefined);
      } else {
        resolve(contents);
      }
    });
  });
};

export const resolveFsFile = async (context, filename) => {
  const paths = [...contextPath(context, filename), ...environmentPaths()];
  return await paths.reduce(async (contents, p) => {
    if (contents) {
      return contents;
    }
    return await fileContents(path.resolve(p, filename));
  }, undefined);
};
