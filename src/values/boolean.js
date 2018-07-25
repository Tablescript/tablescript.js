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

import R from 'ramda';
import { createValue } from './default';
import { valueTypes } from './types';
import { createStringValue } from './string';

const asNativeString = value => () => value ? 'true' : 'false';

const asNativeBoolean = value => () => value;

const nativeEquals = value => (context, other) => value === other.asNativeBoolean(context);

const asBoolean = value => () => createBooleanValue(value);

const equals = nativeEquals => (context, other) => createBooleanValue(nativeEquals(context, other));

const notEquals = nativeEquals => (context, other) => createBooleanValue(!nativeEquals(context, other));

export const createBooleanValue = value => createValue(
  valueTypes.BOOLEAN,
  asNativeBoolean(value),
  {},
  {
    asNativeString: asNativeString(value),
    asNativeBoolean: asNativeBoolean(value),
    nativeEquals: nativeEquals(value),
    asBoolean: asBoolean(value),
    equals: R.pipe(nativeEquals, equals)(value),
    notEquals: R.pipe(nativeEquals, notEquals)(value),
  },
);
