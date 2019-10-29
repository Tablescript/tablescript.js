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

import { throwRuntimeError } from '../error';
import { bindFunctionParameters } from './util/parameters';
import { withSwappedScopes } from './util/context';
import { createValue } from './default';
import { valueTypes } from './types';
import { getTableRoll, getRolledEntryIndex, uniqueN, uniqueEntriesN } from './table-methods';

const asNativeString = () => 'table';

const asNativeBoolean = () => true;

const asArray = entries => () => entries;

const tableEntryScope = (context, formalParameters, entries, closure, roll, index) => ({
  'roll': context.factory.createNumericValue(roll),
  'index': context.factory.createNumericValue(index),
  'this': createTableValue(formalParameters, entries, closure),
});

const buildEntryScope = (formalParameters, entries, closure, roll, index) => context => ([
  closure,
  tableEntryScope(context, formalParameters, entries, closure, roll, index),
]);

const buildCallScope = (formalParameters, entries, closure, roll, index) => (context, parameters) => ([
  closure,
  bindFunctionParameters(context, formalParameters, parameters),
  tableEntryScope(context, formalParameters, entries, closure, roll, index),  
]);

const getElement = (formalParameters, entries, closure) => (context, index) => {
  const roll = index.asNativeNumber();
  const entryIndex = getRolledEntryIndex(entries, roll);
  if (entryIndex >= 0) {
    return withSwappedScopes(
      buildEntryScope(formalParameters, entries, closure, roll, entryIndex),
      entries[entryIndex].evaluate
    )(context);
  }
  return context.factory.createUndefined();
};

const callFunction = (formalParameters, entries, closure) => (context, parameters) => {
  const roll = getTableRoll(entries);
  const entryIndex = getRolledEntryIndex(entries, roll);
  if (entryIndex >= 0) {
    return withSwappedScopes(
      buildCallScope(formalParameters, entries, closure, roll, entryIndex),
      entries[entryIndex].evaluate
    )(context, parameters);
  }
  throwRuntimeError(`Table has no entry for roll of ${roll}`, context);
};

export const createTableValue = (formalParameters, entries, closure) => createValue(
  valueTypes.TABLE,
  asNativeString,
  () => false,
  () => false,
  {
    uniqueN: uniqueN(
      (roll, index) => buildCallScope(formalParameters, entries, closure, roll, index),
      entries
    ),
    uniqueEntriesN: uniqueEntriesN(
      (roll, index) => buildCallScope(formalParameters, entries, closure, roll, index),
      entries
    ),
    //uniqueValuesN: uniqueValuesN(formalParameters, entries, closure),
    //ignoreRolls: ignoreRolls(formalParameters, entries, closure),
    //ignoreRollsBy: ignoreRollsBy(formalParameters, entries, closure),
  },
  {
    asNativeString,
    asNativeBoolean,
    asArray: asArray(entries),
    getElement: getElement(formalParameters, entries, closure),
    callFunction: callFunction(formalParameters, entries, closure),
  },
);
