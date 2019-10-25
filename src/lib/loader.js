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

import path from 'path';

const pathedPrefixes = ['/', './', '../'];

const isPathed = p => pathedPrefixes.reduce((result, prefix) => result || p.startsWith(prefix), false);

const pathFromContext = context => context.locations().length > 0 ? [path.dirname(context.locations()[0].path)] : [];

const environmentPaths = () => (process.env.TS_PATH || '').split(':');

const bundlePaths = () => ([
  'bundles',
  ...environmentPaths()
]);

const allPaths = (context, filename) => isPathed(filename) ? pathFromContext(context) : bundlePaths();

const fileContents = (fs, filePath) => {
  try {
    const contents = fs.readFileSync(filePath, 'utf8');
    return {
      path: filePath,
      body: contents,
    };
  } catch (e) {
    // ignore
  }
  return undefined;
};

const tryPath = (fs, thePath, filename) => {
  const resolvedPath = path.resolve(thePath, filename);
  if (resolvedPath.endsWith('.tab')) {
    return fileContents(fs, resolvedPath);
  }
  const bundleFilename = path.resolve(resolvedPath, 'main.tab');
  const bundleContents = fileContents(fs, bundleFilename);
  if (bundleContents) {
    return bundleContents;
  }
  const resolvedFilename = `${resolvedPath}.tab`;
  return fileContents(fs, resolvedFilename);
};

const tryAllPaths = (fs, paths, filename) => paths.reduce((result, path) => result || tryPath(fs, path, filename), undefined);

export const findAndLoadScript = (context, filename) => tryAllPaths(context.options.io.fs, allPaths(context, filename), filename);
