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

import * as R from 'ramda';

export const randomNumber = n => {
  return Math.floor(Math.random() * n) + 1;
};

const fateRoll = () => randomNumber(3) - 2;

const basicRoll = die => () => randomNumber(die);

const createFateRollSet = (count) => R.range(0, count).map(fateRoll);

const createBasicRollSet = (count, die) => R.range(0, count).map(basicRoll(die));

const createRollSet = (count, die) => (die === 'F' ? createFateRollSet(count) : createBasicRollSet(count, die));

const rollPasses = (roll, test) => {
  if (test.equal) {
    return roll === test.equal;
  }
  if (test.atLeast) {
    return roll >= test.atLeast;
  }
  if (test.noMoreThan) {
    return roll <= test.noMoreThan;
  }
  throw new Error(`Unrecognized test (${R.keys(test)})`);
};

const rerollWhen = (die, test) => roll => {
  let reroll = roll;
  let count = 0;
  while (rollPasses(reroll, test) && count < 100) {
    reroll = randomNumber(die);
    count += 1;
  }
  return reroll;
};

const applyReroll = die => (rolls, rerollSuffix) => R.map(rerollWhen(die, rerollSuffix.test), rolls);

const log = msg => o => {
  console.log(msg, JSON.stringify(o, null, 2));
  return o;
};

const applyAnyRerolls = (die, suffixes) => rolls => R.pipe(
  R.map(R.prop('reroll')),
  R.filter(R.compose(R.not, R.isNil)),
  R.reduce(applyReroll(die), rolls),
)(suffixes);

const keepRoll = (rolls, {specifier, count}) => {
  if (specifier === 'h') {
    return R.takeLast(count, rolls);
  }
  if (specifier === 'l') {
    return R.take(count, rolls);
  }
  throw new Error(`Invalid keep specifier (${specifier})`);
};

const dropRoll = (rolls, {specifier, count}) => {
  if (specifier === 'l') {
    return R.takeLast(R.max(0, R.length(rolls) - count), rolls);
  }
  if (specifier === 'h') {
    return R.take(R.max(0, R.length(rolls) - count), rolls);
  }
  throw new Error(`Invalid drop specifier (${specifier})`);
};

const toSuccess = test => roll => {
  let successes = 0;
  if (rollPasses(roll, test)) {
    successes += 1;
  }
  if (test.failure && rollPasses(roll, test.failure)) {
    successes -= 1;
  }
  return successes;
};

const countSuccess = (rolls, testSuffix) => R.map(toSuccess(testSuffix), rolls);

const keepRolls = suffixes => rolls => R.pipe(
  R.map(R.prop('keep')),
  R.filter(R.compose(R.not, R.isNil)),
  R.reduce(keepRoll, rolls),
)(suffixes);

const dropRolls = suffixes => rolls => R.pipe(
  R.map(R.prop('drop')),
  R.filter(R.compose(R.not, R.isNil)),
  R.reduce(dropRoll, rolls),
)(suffixes);

const countSuccesses = suffixes => rolls => R.pipe(
  R.filter(R.has('test')),
  R.map(R.prop('test')),
  R.reduce(countSuccess, rolls),
)(suffixes);

const applySuffixes = (die, suffixes) => (rolls) => R.pipe(
  applyAnyRerolls(die, suffixes),
  R.sort(R.comparator(R.lt)),
  keepRolls(suffixes),
  dropRolls(suffixes),
  countSuccesses(suffixes),
)(rolls);

export const rollDice = (count, die, suffixes) => R.pipe(
  applySuffixes(die, suffixes),
  R.sum,
)(createRollSet(count, die));

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

const extractSuffixes = s => {
  let suffixes = [];
  let suffix = s;
  while (R.length(suffix) > 0) {
    const dropPattern = /^(d|dl|dh|k|kl|kh)([1-9][0-9]*)?/;
    const dropMatches = suffix.match(dropPattern);
    if (dropMatches) {
      suffixes.push(dropSuffix(dropMatches[1], dropMatches[2] ? parseInt(dropMatches[2], 10) : 1));
      suffix = R.slice(R.length(dropMatches[0]), Infinity, suffix);
      continue;
    }

    const rerollPattern = /^r(?:([1-9][0-9]*)|(?:([><=])([1-9][0-9]*)))?/;
    const rerollMatches = suffix.match(rerollPattern);
    if (rerollMatches) {
      if (rerollMatches[2]) {
        suffixes.push(rerollSuffix(rerollMatches[2], parseInt(rerollMatches[3], 10)));
      } else {
        suffixes.push(rerollSuffix('=', parseInt(rerollMatches[1], 10)));
      }
      suffix = R.slice(R.length(rerollMatches[0]), Infinity, suffix);
      continue;
    }

    const successPattern = /^([><=])([1-9][0-9]*)(?:f([><=])([1-9][0-9]*))?/;
    const successMatches = suffix.match(successPattern);
    if (successMatches) {
      if (successMatches[3]) {
        suffixes.push(successWithFailureSuffix(successMatches[1], parseInt(successMatches[2], 10), successMatches[3], parseInt(successMatches[4], 10)));
      } else {
        suffixes.push(successSuffix(successMatches[1], parseInt(successMatches[2], 10)));
      }
      suffix = R.slice(R.length(rerollMatches[0]), Infinity, suffix);
      continue;
    }

    const endOfStringPattern = /\s*$/;
    if (suffix.match(endOfStringPattern)) {
      break;
    }

    throw new Error(`Invalid dice string: ${suffix}`)
  }

  return suffixes;
}
export const rollDiceFromString = s => {
  const dicePattern = /^\s*([1-9][0-9]*)?d([1-9][0-9]*)/;
  const matches = s.match(dicePattern);
  if (!matches) {
    throw new Error('Invalid dice string');
  }
  const count = parseInt(matches[1], 10);
  const die = parseInt(matches[2], 10);

  const suffix = R.slice(R.length(matches[0]), Infinity, s);
  const suffixes = extractSuffixes(suffix);

  console.log('suffixes', JSON.stringify(suffixes, null, 2));
  return rollDice(count, die, suffixes);
};
