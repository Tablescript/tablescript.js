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
import { rollDice } from './dice';

const dropSuffixes = {
  d: count => ({ drop: { specifier: 'l', count } }),
  dl: count => ({ drop: { specifier: 'l', count } }),
  dh: count => ({ drop: { specifier: 'h', count } }),
  k: count => ({ keep: { specifier: 'h', count } }),
  kl: count => ({ keep: { specifier: 'l', count } }),
  kh: count => ({ keep: { specifier: 'h', count } }),
};

const dropSuffix = (mode, count) => dropSuffixes[mode](count);

const opSuffixes = {
  '=': value => ({ equal: value }),
  '>': value => ({ atLeast: value }),
  '<': value => ({ noMoreThan: value }),
};

const rerollSuffix = (op, value) => ({ reroll: opSuffixes[op](value) });

const successSuffix = (op, value) => ({ test: opSuffixes[op](value) });

const successWithFailureSuffix = (op, value, failureOp, failureValue) => ({
  test: {
    ...opSuffixes[op](value),
    failure: opSuffixes[failureOp](failureValue),
  }
});

const dropPattern = /^(dl|dh|d|kl|kh|k)([1-9][0-9]*)?/;

const dropSuffixFromMatches = matches => dropSuffix(matches[1], matches[2] ? parseInt(matches[2], 10) : 1);

const rerollPattern = /^r(?:([1-9][0-9]*)|(?:([><=])([1-9][0-9]*)))?/;

const rerollSuffixFromMatches = matches => rerollSuffix(matches[2], parseInt(matches[3], 10));

const rerollEqualSuffixFromMatches = matches => rerollSuffix('=', parseInt(matches[1], 10));

const successPattern = /^([><=])([1-9][0-9]*)(?:f([><=])([1-9][0-9]*))?/;

const remainingString = (head, s) => R.slice(R.length(head), Infinity, s);

const extractSuffixes = (s, suffixes = []) => {
  const endOfStringPattern = /^\s*$/;
  if (s.match(endOfStringPattern)) {
    return suffixes;
  }

  const dropMatches = s.match(dropPattern);
  if (dropMatches) {
    return extractSuffixes(
      remainingString(dropMatches[0], s),
      R.append(dropSuffixFromMatches(dropMatches), suffixes),
    );
  }

  const rerollMatches = s.match(rerollPattern);
  if (rerollMatches) {
    return extractSuffixes(
      remainingString(rerollMatches[0], s),
      R.append(
        rerollMatches[2] ? (
          rerollSuffixFromMatches(rerollMatches)
        ) : (
          rerollEqualSuffixFromMatches(rerollMatches)
        ),
        suffixes,
      ),
    );
  }

  const successMatches = s.match(successPattern);
  if (successMatches) {
    return extractSuffixes(
      remainingString(successMatches[0], s),
      R.append(
        successMatches[3] ? (
          successWithFailureSuffix(successMatches[1], parseInt(successMatches[2], 10), successMatches[3], parseInt(successMatches[4], 10))
        ) : (
          successSuffix(successMatches[1], parseInt(successMatches[2], 10))
        ),
        suffixes,
      ),
    );
  }

  throw new Error(`Invalid dice string: ${s}`)
};

export const rollDiceFromString = s => {
  const dicePattern = /^\s*([1-9][0-9]*)?d([1-9][0-9]*)/;
  const matches = s.match(dicePattern);
  if (!matches) {
    throw new Error('Invalid dice string');
  }
  const count = parseInt(matches[1], 10) || 1;
  const die = parseInt(matches[2], 10);

  const suffix = R.slice(R.length(matches[0]), Infinity, s);
  const suffixes = extractSuffixes(suffix);

  return rollDice(count, die, suffixes);
};
