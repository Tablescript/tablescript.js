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
import { randomNumber, nRolls } from '../util/random';
import { withSwappedScopes } from './util/context';

const getTableDie = entries => entries.reduce((max, entry, index) => Math.max(max, entry.getHighestSelector(index + 1)), 0);

export const getTableRoll = R.pipe(getTableDie, randomNumber);

export const getRolledEntry = (entries, roll) => entries.find((e, index) => e.rollApplies(roll, index + 1));

export const getRolledEntryIndex = (entries, roll) => entries.findIndex((e, index) => e.rollApplies(roll, index + 1));

const evaluateEntry = (closure, buildScope, context, parameters) => entry => {
  const oldScopes = context.swapScope(closure);
  context.pushScope(buildScope(context, parameters));
  const result = entry.evaluate(context);
  context.swapScope(oldScopes);
  return result;
};

export const multiple = (closure, buildScope, entries) => createNativeFunctionValue(
  'multiple',
  ['n'],
  (context, args, n) => {
    if (n.asNativeNumber() <= 0) {
      throwRuntimeError(`multiple(n) n must more than 0`, context);
    }
    const die = getTableDie(entries);
    return R.map(
      ([roll, index, entry]) => evaluateEntry(closure, buildScope(roll, index), context, args.slice(1))(entry),
      R.map(
        roll => ([
          roll,
          getRolledEntryIndex(entries, roll),
          getRolledEntry(entries, roll),
        ]),
        nRolls(n.asNativeNumber(), die),
      ),
    );
  },
  toArrayResult,
);

const rollWithIgnore = (context, entries, die, f) => {
  let count = 0;
  while (count < context.options.values.maximumTableIgnoreCount) {
    const roll = randomNumber(die);
    const entryIndex = getRolledEntryIndex(entries, roll);
    const ignore = f.callFunction(context, [context.factory.createNumericValue(roll), context.factory.createNumericValue(entryIndex)]);
    if (!ignore.asNativeBoolean()) {
      return [roll, entryIndex];
    }
    count += 1;
  }
  throwRuntimeError(`All ${count} rolls were ignored`, context);
};

export const ignore = (closure, buildScope, entries) => createNativeFunctionValue(
  'ignore',
  ['f'],
  (context, args, f) => {
    const die = getTableDie(entries);
    const [roll, entryIndex] = rollWithIgnore(context, entries, die, f);
    const entry = entries[entryIndex];
    return evaluateEntry(closure, buildScope(roll, entryIndex), context, args.slice(1))(entry);
  },
);

const nUniqueWithIgnore = (n, context, entries, die, f) => {
  let rolls = [];
  let count = 0;
  while (count < context.options.values.maximumTableUniqueAttempts) {
    const roll = rollWithIgnore(context, entries, die, f);
    rolls = R.uniqBy(R.nth(1), R.append(roll, rolls));
    if (rolls.length === n) {
      return rolls;
    }
    count += 1;
  }
  throwRuntimeError(`Tried ${count} times for unique rolls`, context);
};

const nUnique = (n, entries, die) => {
  let rolls = [];
  while (rolls.length < n) {
    const roll = randomNumber(die);
    const entryIndex = getRolledEntryIndex(entries, roll);
    rolls = R.uniqBy(R.nth(1), R.append([roll, entryIndex], rolls));
  }
  return rolls;
};

export const unique = (closure, buildScope, entries) => createNativeFunctionValue(
  'unique',
  ['n'],
  (context, args, n) => {
    if (n.asNativeNumber() <= 0) {
      throwRuntimeError(`unique(n) n must more than 0`, context);
    }
    if (n.asNativeNumber() > entries.length) {
      throwRuntimeError(`unique(n) n cannot be more than ${entries.length}`, context);
    }
    const die = getTableDie(entries);
    if (n.asNativeNumber() === entries.length) {
      return R.map(
        entry => evaluateEntry(
          closure,
          buildScope(entry.getLowestSelector(), getRolledEntryIndex(entries, entry.getLowestSelector())),
          context,
          args.slice(1)
        )(entry),
        entries,
      );
    }
    const rolls = nUnique(n.asNativeNumber(), entries, die);
    return R.map(
      ([roll, index, entry]) => evaluateEntry(closure, buildScope(roll, index), context, args.slice(1))(entry),
      R.map(
        ([roll, index]) => ([
          roll,
          index,
          entries[index],
        ]),
        rolls,
      ),
    );
  },
  toArrayResult,
);

export const uniqueIgnore = (closure, buildScope, entries) => createNativeFunctionValue(
  'uniqueIgnore',
  ['n', 'f'],
  (context, args, n, f) => {
    if (n.asNativeNumber() <= 0) {
      throwRuntimeError(`unique(n, f) n must more than 0`, context);
    }
    const die = getTableDie(entries);
    const rolls = nUniqueWithIgnore(n.asNativeNumber(), context, entries, die, f);
    return R.map(
      ([roll, index, entry]) => evaluateEntry(closure, buildScope(roll, index), context, args.slice(2))(entry),
      R.map(
        ([roll, index]) => ([
          roll,
          index,
          entries[index],
        ]),
        rolls,
      ),
    );
  },
  toArrayResult,
);
