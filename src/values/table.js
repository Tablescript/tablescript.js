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

import { defaultValue } from './default';
import { valueTypes } from './types';
import { randomNumber } from '../util/random';
import { createUndefined } from './undefined';
import { createNumericValue } from './numeric';
import { createNativeFunctionValue } from './function';

export const createTableValue = (formalParameters, entries, closure) => {
  const parametersToArguments = parameters => {
    const o = {};
    for (let i = 0; i < parameters.length; i++) {
      o[formalParameters[i]] = parameters[i];
    }
    return o;
  };

  const asNativeString = () => 'table';
  const asNativeBoolean = () => true;
  const nativeEquals = () => false;
  const asString = () => createStringValue(asNativeString());
  const asBoolean = () => createBooleanValue(asNativeBoolean());
  const asArray = () => entries;
  const getElement = async (context, index) => {
    const indexValue = index.asNativeNumber(context);
    const selectedEntry = entries.find((e, index) => e.rollApplies(indexValue, index + 1));
    if (selectedEntry) {
      const localScope = {
        ...closure,
        roll: createNumericValue(indexValue),
        'this': createTableValue(formalParameters, entries, closure),
      };
      return await selectedEntry.evaluate(localScope);
    }
    return createUndefined();
  };
  const callFunction = async (context, scope, parameters) => {
    const die = entries.reduce((max, entry, index) => Math.max(max, entry.getHighestSelector(index + 1)), 0);
    const roll = randomNumber(die);
    const rolledEntry = entries.find((e, index) => e.rollApplies(roll, index + 1));
    const localScope = {
      ...closure,
      ...parametersToArguments(parameters),
      'roll': createNumericValue(roll),
      'this': createTableValue(formalParameters, entries, closure),
    };
    return await rolledEntry.evaluate(localScope);
  };
  const equals = () => createBooleanValue(false);

  return {
    ...defaultValue(valueTypes.TABLE, asNativeString),
    asNativeString,
    asNativeBoolean,
    nativeEquals,
    asString,
    asBoolean,
    asArray,
    getElement,
    callFunction,
    equals,
  };
};
