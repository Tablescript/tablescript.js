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

import R from 'ramda';
import { createValue } from './default';
import { valueTypes } from './types';
import { randomNumber } from '../util/random';
import { createUndefined } from './undefined';
import { createNumericValue } from './numeric';
import { mapFunctionParameters } from '../util/parameters';
import { replaceScope, pushStack } from '../context';

const asNativeString = () => 'table';

const asNativeBoolean = () => true;

const nativeEquals = () => false;

const asString = asNativeString => () => createStringValue(asNativeString());

const asBoolean = asNativeBoolean => () => createBooleanValue(asNativeBoolean());

const asArray = entries => () => entries;

const tableEntryScope = (formalParameters, entries, closure, roll) => ({
  'roll': createNumericValue(roll),
  'this': createTableValue(formalParameters, entries, closure),
});

const getElement = (formalParameters, entries, closure) => async (context, index) => {
  const roll = index.asNativeNumber(context);
  const selectedEntry = entries.find((e, index) => e.rollApplies(roll, index + 1));
  if (selectedEntry) {
    const localContext = pushStack(replaceScope(context, {
      ...closure,
      ...tableEntryScope(formalParameters, entries, closure, roll),
    }));
    return await selectedEntry.evaluate(localContext);
  }
  return createUndefined();
};

const getTableDie = entries => entries.reduce((max, entry, index) => Math.max(max, entry.getHighestSelector(index + 1)), 0);

const getTableRoll = R.pipe(getTableDie, randomNumber);

const getRolledEntry = (entries, roll) => entries.find((e, index) => e.rollApplies(roll, index + 1));

const callFunction = (formalParameters, entries, closure) => async (context, parameters) => {
  const roll = getTableRoll(entries);
  const rolledEntry = getRolledEntry(entries, roll);
  const localContext = pushStack(replaceScope(context, {
    ...closure,
    ...mapFunctionParameters(formalParameters, parameters),
    ...tableEntryScope(formalParameters, entries, closure, roll),  
  }));
  return await rolledEntry.evaluate(localContext);
};

const equals = () => createBooleanValue(false);

export const createTableValue = (formalParameters, entries, closure) => createValue(
  valueTypes.TABLE,
  asNativeString(),
  {},
  {
    asNativeString,
    asNativeBoolean,
    nativeEquals,
    asString: R.pipe(asNativeString, asString)(),
    asBoolean: R.pipe(asNativeBoolean, asBoolean)(),
    asArray: asArray(entries),
    getElement: getElement(formalParameters, entries, closure),
    callFunction: callFunction(formalParameters, entries, closure),
    equals,
  },
);
