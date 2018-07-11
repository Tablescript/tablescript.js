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

import { createTableValue } from '../values/table';
import { createExpression } from './default';
import { expressionTypes } from './types';

const expandEntries = async (scope, entries) => {
  let results = [];
  for (let i = 0; i < entries.length; i++) {
    const expandedEntries = await entries[i].expand(scope);
    results = [ ...results, ...expandedEntries];
  }
  return results;
};

export const createTableExpression = (context, formalParameters, entries) => {
  const evaluate = async scope => {
    const expandedEntries = await expandEntries(scope, entries);
    return createTableValue(
      formalParameters,
      expandedEntries,
      { ...scope }
    );
  };

  return createExpression(expressionTypes.TABLE, evaluate);
};
