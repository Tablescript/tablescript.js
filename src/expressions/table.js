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

import { expressionTypes } from './types';
import { createExpression } from './default';
import { createTableValue } from '../values/table';

const entryExpander = scope => (p, entry) => {
  return p.then(acc => new Promise(resolve => {
    entry.expand(scope).then(expandedEntries => {
      resolve([
        ...acc,
        ...expandedEntries,
      ]);
    });
  }));
};

const expandEntries = (scope, entries) => {
  return entries.reduce(entryExpander(scope), Promise.resolve([]));
};

const evaluate = (formalParameters, entries) => async scope => createTableValue(formalParameters, await expandEntries(scope, entries), scope);

export const createTableExpression = (formalParameters, entries) => createExpression(expressionTypes.TABLE, evaluate(formalParameters, entries));
