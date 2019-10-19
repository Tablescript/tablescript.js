import * as R from 'ramda';
import { randomNumber } from './random';

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
