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

import * as R from 'ramda';

const fileContents = (context, filePath) => {
  const { fs } = context.options.io;
  if (context.options.flags.debug) {
    console.log('Loader:', `Trying to load ${filePath}...`);
  }
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

const globalPaths = (path, moduleName) => R.isNil(process.env.TS_PATH) ? [] : R.reduce(
  (paths, globalPath) => ([
    ...paths,
    path.resolve(globalPath, `${moduleName}.tab`),
    path.resolve(globalPath, moduleName, 'main.tab'),
  ]),
  [],
  R.split(':', process.env.TS_PATH),
);

const pathedPrefixes = ['/', './', '../'];

const isPathed = p => pathedPrefixes.reduce((result, prefix) => result || p.startsWith(prefix), false);

const tryPaths = (context, paths) => paths.reduce((script, path) => script || fileContents(context, path), undefined);

export const findAndLoadScript = (context, moduleName) => {
  const { path } = context.options.io;
  if (isPathed(moduleName)) {
    return tryPaths(
      context,
      [
        path.resolve(path.dirname(context.currentPath()), `${moduleName}.tab`),
        path.resolve(path.dirname(context.currentPath()), moduleName, 'main.tab'),
      ],
    );
  }
  return tryPaths(
    context,
    [
      path.resolve(path.dirname(context.rootPath()), 'bundles', `${moduleName}.tab`),
      path.resolve(path.dirname(context.rootPath()), 'bundles', moduleName, 'main.tab'),
      ...globalPaths(path, moduleName),
    ],
  );
};

export const loadScript = (context, filename) => fileContents(context, filename);
