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
  evaluate: async scope => {
    return await body.evaluate(scope);
  },
  getReferencedSymbols: () => body.getReferencedSymbols(),
  getHighestSelector: () => selector.highestSelector,
  rollApplies: actualRoll => selector.rollApplies(actualRoll),
});

export const createTableEntryExpression = (selector, body) => ({
  expand: () => ([createTableEntry(selector, body)]),
  getReferencedSymbols: () => body.getReferencedSymbols(),
});

const createSimpleTableEntry = body => ({
  evaluate: async scope => {
    return await body.evaluate(scope);
  },
  getReferencedSymbols: () => body.getReferencedSymbols(),
  getHighestSelector: index => index,
  rollApplies: (actualRoll, index) => (actualRoll === index),
});

export const createSimpleTableEntryExpression = body => ({
  expand: () => ([createSimpleTableEntry(body)]),
  getReferencedSymbols: () => body.getReferencedSymbols(),
});

const createLiteralTableEntry = value => ({
  evaluate: async scope => {
    return value;
  },
  getReferencedSymbols: () => [],
  getHighestSelector: index => index,
  rollApplies: (actualRoll, index) => (actualRoll === index),
});

export const createSpreadTableEntryExpression = spread => ({
  expand: async scope => {
    const spreadValue = await spread.evaluate(scope);
    if (spreadValue.type === valueTypes.ARRAY_SPREAD) {
      return spreadValue.asArray().map(entry => createLiteralTableEntry(entry));
    } else if (spreadValue.type === valueTypes.TABLE_SPREAD) {
      return spreadValue.asArray();
    } else {
      throwRuntimeError(`Can only spread ARRAY and TABLE into TABLE`);
    }
  },
  getReferencedSymbols: () => spread.getReferencedSymbols(),
});
