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

const asNativeString = (formalParameters, entries, closure, options) => () => 'table';
const asNativeBoolean = (formalParameters, entries, closure, options) => () => true;
const nativeEquals = (formalParameters, entries, closure, options) => () => false;
const asString = asNativeString => () => createStringValue(asNativeString());
const asBoolean = asNativeBoolean => () => createBooleanValue(asNativeBoolean());
const asArray = (formalParameters, entries, closure, options) => () => entries;

const tableEntryScope = (formalParameters, entries, closure, roll) => ({
  'roll': createNumericValue(roll),
  'this': createTableValue(formalParameters, entries, closure),
});

const getElement = (formalParameters, entries, closure, options) => async (context, index) => {
  const roll = index.asNativeNumber(context);
  const selectedEntry = entries.find((e, index) => e.rollApplies(roll, index + 1));
  if (selectedEntry) {
    return await selectedEntry.evaluate({
      ...closure,
      ...tableEntryScope(formalParameters, entries, closure, roll),
    }, options);
  }
  return createUndefined();
};

const getTableDie = entries => entries.reduce((max, entry, index) => Math.max(max, entry.getHighestSelector(index + 1)), 0);

const getTableRoll = R.pipe(getTableDie, randomNumber);

const getRolledEntry = (entries, roll) => entries.find((e, index) => e.rollApplies(roll, index + 1));

const callFunction = (formalParameters, entries, closure, options) => async (context, parameters) => {
  const roll = getTableRoll(entries);
  const rolledEntry = getRolledEntry(entries, roll);
  return await rolledEntry.evaluate({
    ...closure,
    ...mapFunctionParameters(formalParameters, parameters),
    ...tableEntryScope(formalParameters, entries, closure, roll),
  }, options);
};

const equals = nativeEquals => () => createBooleanValue(nativeEquals());

const methods = {
  asNativeString,
  asNativeBoolean,
  nativeEquals,
  asString: R.pipe(asNativeString, asString),
  asBoolean: R.pipe(asNativeBoolean, asBoolean),
  asArray,
  getElement,
  callFunction,
  equals: R.pipe(nativeEquals, equals),
};

export const tableMethods = (formalParameters, entries, closure, options) => Object.keys(methods).reduce((acc, m) => ({ ...acc, [m]: methods[m](formalParameters, entries, closure, options) }), {});

export const createCustomTableValue = (formalParameters, entries, closure, options) => createValue(
  valueTypes.TABLE,
  asNativeString(formalParameters, entries, closure),
  [],
  tableMethods(formalParameters, entries, closure, options),
);

export const createTableValue = (formalParameters, entries, closure, options) => createCustomTableValue(formalParameters, entries, closure, options);
