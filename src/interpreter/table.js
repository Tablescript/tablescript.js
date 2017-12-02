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

import { runtimeErrorThrower } from '../error';
import { valueTypes } from './types';
import { randomNumber } from './random';
import { createUndefined } from './undefined';
import { createNumericValue } from './numeric';

export const createTableValue = (formalParameters, entries) => {
  const parametersToArguments = parameters => {
    const o = {};
    for (let i = 0; i < parameters.length; i++) {
      o[formalParameters[i]] = parameters[i];
    }
    return o;
  };

  return {
    type: valueTypes.TABLE,
    asNativeValue: () => 'table',
    asNumber: runtimeErrorThrower('Cannot cast table to number'),
    asString: () => 'table',
    asBoolean: () => true,
    equals: () => false,
    getProperty: runtimeErrorThrower('Cannot get property of table'),
    setProperty: runtimeErrorThrower('Cannot set property of table'),
    getElement: (context, index) => {
      const indexValue = index.asNativeNumber(context);
      const selectedEntry = entries.find(e => e.rollApplies(indexValue));
      if (selectedEntry) {
        const localScope = Object.assign({}, scope, { roll: createNumericValue(indexValue) });
        return selectedEntry.evaluate(localScope);
      }
      return createUndefined();
    },
    callFunction: (context, scope, parameters) => {
      const die = entries.reduce((max, entry, index) => Math.max(max, entry.getHighestSelector(index)), 0);
      const roll = randomNumber(die);
      const rolledEntry = entries.find((e, index) => e.rollApplies(roll, index));
      const localScope = Object.assign({}, scope, parametersToArguments(parameters), { roll: createNumericValue(roll) });
      return rolledEntry.evaluate(localScope);
    },
  };
};
