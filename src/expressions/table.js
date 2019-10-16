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
import { TablescriptError } from '../error';

const entryExpander = context => (p, entry) => {
  return p.then(acc => new Promise((resolve, reject) => {
    console.log('***', JSON.stringify(entry, null, 2));
    entry.expand(context).then(expandedEntries => {
      resolve([
        ...acc,
        ...expandedEntries,
      ]);
    }).catch(e => {
      reject(e);
    });
  }));
};

const validateEntries = (context, entries) => {
  const allSelectors = entries.reduce((acc, e, i) => {
    const low = e.getLowestSelector(i + 1);
    const high = e.getHighestSelector(i + 1);
    let result = acc.set;
    for (let j = low; j <= high; j += 1) {
      result = result.add(j);
    }
    return {
      max: Math.max(acc.max, high),
      set: result,
    };
  }, {
    max: 0,
    set: new Set(),
  });
  for (let i = 1; i <= allSelectors.max; i += 1) {
    if (!allSelectors.set.has(i)) {
      throw new TablescriptError('RuntimeError', `Table missing entry for ${i}`, context);
    }
  }
};

const expandEntries = async (context, entries) => {
  const expandedEntries = await entries.reduce(entryExpander(context), Promise.resolve([]));
  if (context.options.flags.validateTables) {
    validateEntries(context, expandedEntries);
  }
  return expandedEntries;
};

const evaluate = (location, formalParameters, entries) => async context => {
  context.setLocation(location);
  return createTableValue(formalParameters, await expandEntries(context, entries), context.getScope());
};

export const createTableExpression = (location, formalParameters, entries) => createExpression(
  expressionTypes.TABLE,
  evaluate(location, formalParameters, entries)
);
