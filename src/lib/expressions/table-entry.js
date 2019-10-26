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

import { isArraySpread, isTableSpread } from '../values';
import { throwRuntimeError } from '../error';

const createTableEntry = (selector, body) => ({
  evaluate: body.evaluate,
  getLowestSelector: () => selector.lowestSelector,
  getHighestSelector: () => selector.highestSelector,
  rollApplies: actualRoll => selector.rollApplies(actualRoll),
});

const createSimpleTableEntry = body => ({
  evaluate: body.evaluate,
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
  expand: () => ([createTableEntry(selector, body)]),
});

export const createSimpleTableEntryExpression = body => ({
  expand: () => ([createSimpleTableEntry(body)]),
});  

export const createSpreadTableEntryExpression = spread => ({
  expand: context => {
    const spreadValue = spread.evaluate(context);
    if (isArraySpread(spreadValue)) {
      return spreadValue.asArray().map(entry => createLiteralTableEntry(entry));
    }
    if (isTableSpread(spreadValue)) {
      return spreadValue.asArray();
    }
    throwRuntimeError(`Can only spread ARRAY and TABLE into TABLE`, context);
  },
});
