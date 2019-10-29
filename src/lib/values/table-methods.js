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
import {
  createNativeFunctionValue,
  toArrayResult,
} from './native-function';
import { throwRuntimeError } from '../error';
import { randomNumber, nUniqueRolls } from '../util/random';
import { withSwappedScopes } from './util/context';

const getTableDie = entries => entries.reduce((max, entry, index) => Math.max(max, entry.getHighestSelector(index + 1)), 0);

export const getTableRoll = R.pipe(getTableDie, randomNumber);

export const getRolledEntry = (entries, roll) => entries.find((e, index) => e.rollApplies(roll, index + 1));

export const getRolledEntryIndex = (entries, roll) => entries.findIndex((e, index) => e.rollApplies(roll, index + 1));

const evaluateEntry = (buildCallScope, context, parameters) => entry => withSwappedScopes(
  buildCallScope,
  entry.evaluate,
)(context, parameters);

export const uniqueN = (buildCallScope, entries) => createNativeFunctionValue(
  'uniqueN',
  ['n'],
  (context, args, n) => {
    if (n.asNativeNumber() <= 0) {
      throwRuntimeError(`uniqueN(n) n must more than 0`, context);
    }
    const die = getTableDie(entries);
    if (n.asNativeNumber() > die) {
      throwRuntimeError(`uniqueN(n) n cannot be higher than ${die}`, context);
    }
    if (n.asNativeNumber() === die) {
      return R.addIndex(R.map)(
        entry => evaluateEntry(buildCallScope(entry.getLowestSelector(), getRolledEntryIndex(entry.getLowestSelector())), context, args.slice(1))(entry),
        entries,
      );
    }
    return R.map(
      ([roll, index, entry]) => evaluateEntry(buildCallScope(roll, index), context, args.slice(1))(entry),
      R.map(
        roll => ([
          roll,
          getRolledEntryIndex(entries, roll),
          getRolledEntry(entries, roll),
        ]),
        nUniqueRolls(n.asNativeNumber(), die),
      ),
    );
  },
  toArrayResult,
);

const nUniqueEntryIndices = (n, entries, max) => {
  let indices = [];
  while (indices.length < n) {
    const roll = randomNumber(max);
    const entryIndex = getRolledEntryIndex(entries, roll);
    indices = R.uniqBy(R.nth(1), R.append([entryIndex, roll], indices));
  }
  return indices;
};  

export const uniqueEntriesN = (buildCallScope, entries) => createNativeFunctionValue(
  'uniqueEntriesN',
  ['n'],
  (context, args, n) => {
    if (n.asNativeNumber() <= 0) {
      throwRuntimeError(`uniqueEntriesN(n) n must more than 0`, context);
    }
    const die = getTableDie(entries);
    if (n.asNativeNumber() > entries.length) {
      throwRuntimeError(`uniqueEntriesN(n) n cannot be higher than ${entries.length}`, context);
    }
    if (n.asNativeNumber() === entries.length) {
      return R.map(
        entry => evaluateEntry(buildCallScope(entry.getLowestSelector(), getRolledEntryIndex(entry.getLowestSelector())), context, args.slice(1))(entry),
        entries,
      );
    }
    return R.map(
      ([roll, index, entry]) => evaluateEntry(buildCallScope(roll, index), context, args.slice(1))(entry),
      R.map(
        ([index, roll]) => ([
          roll,
          index,
          entries[index],
        ]),
        nUniqueEntryIndices(n.asNativeNumber(), entries, die),
      ),
    );
  },
  toArrayResult,
);
