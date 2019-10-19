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
import { requiredParameter } from '../util/parameters';
import { isObject } from 'util';
import { throwRuntimeError } from '../error';

export const keysBuiltIn = context => {
  const object = requiredParameter(context, 'o');
  if (!isObject(object)) {
    throwRuntimeError('keys(o) o must be object', context);
  }
  return R.compose(
    context.factory.createArrayValue,
    R.map(context.factory.createStringValue),
    R.sort(R.comparator(R.lt)),
    R.keys,
  )(object.asNativeObject());
};
