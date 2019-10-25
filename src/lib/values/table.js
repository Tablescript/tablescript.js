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
import { createValue } from './default';
import { valueTypes } from './types';
import { randomNumber } from '../util/random';
import { bindFunctionParameters } from './util/parameters';
import { withSwappedScopes } from './util/context';

const asNativeString = () => 'table';

const asNativeBoolean = () => true;

const asArray = entries => () => entries;

const tableEntryScope = (context, formalParameters, entries, closure, roll) => ({
  'roll': context.factory.createNumericValue(roll),
  'this': createTableValue(formalParameters, entries, closure),
});

const getElement = (formalParameters, entries, closure) => (context, index) => {
  const roll = index.asNativeNumber();
  const selectedEntry = entries.find((e, index) => e.rollApplies(roll, index + 1));
  if (selectedEntry) {
    return withSwappedScopes(
      context => ([
        closure,
        tableEntryScope(context, formalParameters, entries, closure, roll),
      ]),
      selectedEntry.evaluate
    )(context);
  }
  return context.factory.createUndefined();
};

const getTableDie = entries => entries.reduce((max, entry, index) => Math.max(max, entry.getHighestSelector(index + 1)), 0);

const getTableRoll = R.pipe(getTableDie, randomNumber);

const getRolledEntry = (entries, roll) => entries.find((e, index) => e.rollApplies(roll, index + 1));

const callFunction = (formalParameters, entries, closure) => (context, parameters) => {
  const roll = getTableRoll(entries);
  const rolledEntry = getRolledEntry(entries, roll);
  return withSwappedScopes(
    (context, parameters) => ([
      closure,
      bindFunctionParameters(context, formalParameters, parameters),
      tableEntryScope(context, formalParameters, entries, closure, roll),  
    ]),
    rolledEntry.evaluate
  )(context, parameters);
};

export const createTableValue = (formalParameters, entries, closure) => createValue(
  valueTypes.TABLE,
  asNativeString,
  () => false,
  () => false,
  {},
  {
    asNativeString,
    asNativeBoolean,
    asArray: asArray(entries),
    getElement: getElement(formalParameters, entries, closure),
    callFunction: callFunction(formalParameters, entries, closure),
  },
);
