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

import { valueTypes } from '../values/types';
import { throwRuntimeError } from '../error';

const createTableEntry = (selector, body) => ({
  evaluate: async scope => await body.evaluate(scope),
  getLowestSelector: () => selector.lowestSelector,
  getHighestSelector: () => selector.highestSelector,
  rollApplies: actualRoll => selector.rollApplies(actualRoll),
});

const createSimpleTableEntry = body => ({
  evaluate: async scope => await body.evaluate(scope),
  getLowestSelector: index => index,
  getHighestSelector: index => index,
  rollApplies: (actualRoll, index) => (actualRoll === index),
});

const createLiteralTableEntry = value => ({
  evaluate: () => value,
  getLowestSelector: index => index,
  getHighestSelector: index => index,
  rollApplies: (actualRoll, index) => (actualRoll === index),
});

export const createTableEntryExpression = (selector, body) => ({
  expand: () => Promise.resolve([createTableEntry(selector, body)]),
});

export const createSimpleTableEntryExpression = body => ({
  expand: () => Promise.resolve([createSimpleTableEntry(body)]),
});  

export const createSpreadTableEntryExpression = spread => ({
  expand: async scope => {
    const spreadValue = await spread.evaluate(scope);
    if (spreadValue.type === valueTypes.ARRAY_SPREAD) {
      return spreadValue.asArray().map(entry => createLiteralTableEntry(entry));
    }
    if (spreadValue.type === valueTypes.TABLE_SPREAD) {
      return spreadValue.asArray();
    }
    throwRuntimeError(`Can only spread ARRAY and TABLE into TABLE`);
  },
});
