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

import { requiredParameter } from '../util/parameters';
import { isString, isNumber, isBoolean } from '../values/types';
import { throwRuntimeError } from '../error';

export const strBuiltIn = context => {
  const s = requiredParameter(context, 's');
  if (isString(s)) {
    return s;
  }
  return context.factory.createStringValue(s.asNativeString());
};

export const intBuiltIn = context => {
  const i = requiredParameter(context, 'i');
  if (isNumber(i)) {
    return context.factory.createNumericValue(Math.round(i.asNativeValue()));
  }
  if (isString(i)) {
    return context.factory.createNumericValue(parseInt(i.asNativeString()));
  }
  if (isBoolean(i)) {
    return context.factory.createNumericValue(i.asNativeBoolean() ? 1 : 0);
  }
  throwRuntimeError(`Cannot convert #{i.type} to NUMBER`);
};
