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
import { asyncReduce } from './util/async';

const pathedPrefixes = ['/', './', '../'];

const isPathed = p => pathedPrefixes.reduce((result, prefix) => result || p.startsWith(prefix), false);

const pathFromContext = context => context.locations().length > 0 ? [path.dirname(context.locations()[0].path)] : [];

const environmentPaths = () => (process.env.TS_PATH || '').split(':');

const bundlePaths = () => ([
  'bundles',
  ...environmentPaths()
]);

const allPaths = (context, filename) => isPathed(filename) ? pathFromContext(context) : bundlePaths();

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

const tryPath = async (thePath, filename) => {
  const resolvedPath = path.resolve(thePath, filename);
  const bundleFilename = path.resolve(resolvedPath, 'main.tab');
  const bundleContents = await fileContents(bundleFilename);
  if (bundleContents) {
    return bundleContents;
  }
  const resolvedFilename = `${resolvedPath}.tab`;
  return fileContents(resolvedFilename);
};

const tryAllPaths = (paths, filename) => asyncReduce(paths, (result, path) => result || tryPath(path, filename), undefined);

export const loadFsFile = async (context, filename) => tryAllPaths(allPaths(context, filename), filename);
