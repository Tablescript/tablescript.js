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

import { createTableValue } from '../values/table';
import { defaultExpression } from './default-expression';
import { expressionTypes } from './types';

export const createTableExpression = (context, parameters, entries) => {
  
  const evaluate = scope => createTableValue(parameters, entries);

  const getReferencedSymbols = () => ([
    ...parameters.reduce((result, parameter) => [...result, ...parameter.getReferencedSymbols()], []),
    ...entries.reduce((result, entry) => [...result, ...entry.getReferencedSymbols()], []),
  ]);

  return {
    ...defaultExpression(expressionTypes.TABLE, evaluate, getReferencedSymbols),
  };
};

export const createTableEntry = (selector, body) => {
  return {
    evaluate: async scope => {
      return await body.evaluate(scope);
    },
    getReferencedSymbols: () => body.getReferencedSymbols(),
    getHighestSelector: () => selector.highestSelector,
    rollApplies: actualRoll => selector.rollApplies(actualRoll),
  };
};

export const createNextTableEntry = body => {
  return {
    evaluate: async scope => {
      return await body.evaluate(scope);
    },
    getReferencedSymbols: () => body.getReferencedSymbols(),
    getHighestSelector: index => (index + 1),
    rollApplies: (actualRoll, index) => (actualRoll === index + 1),
  };
};

export const createRangeTableSelector = (rangeStart, rangeEnd) => {
  return {
    highestSelector: rangeEnd,
    rollApplies: actualRoll => actualRoll >= rangeStart && actualRoll <= rangeEnd,
  };
};

export const createExactTableSelector = roll => {
  return {
    highestSelector: roll,
    rollApplies: actualRoll => actualRoll === roll,
  };
};
