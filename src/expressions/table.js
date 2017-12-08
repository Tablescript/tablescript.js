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
import { defaultExpression } from './default';
import { expressionTypes } from './types';
import { valueTypes } from '../values/types';

export const createTableExpression = (context, formalParameters, entries) => {
  const createClosure = (entries, parameters, scope) => {
    return entries.reduce((acc, e) => ([...acc, ...e.getReferencedSymbols()]), [])
      .filter(v => !formalParameters.includes(v))
      .reduce((result, symbol) => ({ ...result, [symbol]: scope[symbol] }), {});
  };

  const expandEntries = async (scope, entries) => {
    let results = [];
    for (let i = 0; i < entries.length; i++) {
      const expandedEntries = await entries[i].expand(scope);
      results = [ ...results, ...expandedEntries];
    }
    return results;
  };

  const evaluate = async scope => {
    const expandedEntries = await expandEntries(scope, entries);
    return createTableValue(
      formalParameters,
      expandedEntries,
      createClosure(expandedEntries, formalParameters, scope)
    );
  };

  const getReferencedSymbols = () => ([
    ...formalParameters.reduce((result, parameter) => [...result, ...parameter.getReferencedSymbols()], []),
    ...entries.reduce((result, entry) => [...result, ...entry.getReferencedSymbols()], []),
  ]);

  return {
    ...defaultExpression(expressionTypes.TABLE, evaluate, getReferencedSymbols),
  };
};

export const createTableEntry = (selector, body) => {
  return {
    expand: async () => ([
      {
        evaluate: async scope => {
          return await body.evaluate(scope);
        },
        getReferencedSymbols: () => body.getReferencedSymbols(),
        getHighestSelector: () => selector.highestSelector,
        rollApplies: actualRoll => selector.rollApplies(actualRoll),
      },
    ]),
  };
};

export const createNextTableEntry = body => {
  return {
    expand: async () => ([
      {
        evaluate: async scope => {
          return await body.evaluate(scope);
        },
        getReferencedSymbols: () => body.getReferencedSymbols(),
        getHighestSelector: index => index,
        rollApplies: (actualRoll, index) => (actualRoll === index),
      },
    ]),
  };
};

export const createLiteralTableEntry = value => {
  return {
    evaluate: async scope => {
      return value;
    },
    getReferencedSymbols: () => [],
    getHighestSelector: index => index,
    rollApplies: (actualRoll, index) => (actualRoll === index),
  };
};

export const createSpreadTableEntry = spread => {
  return {
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
