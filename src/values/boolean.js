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
const nativeEquals = value => (location, other) => value === other.asNativeBoolean(location);
const asString = asNativeString => location => createStringValue(asNativeString(location));
const asBoolean = value => () => createBooleanValue(value);
const equals = nativeEquals => (location, otherValue) => createBooleanValue(nativeEquals(location, otherValue));
const notEquals = nativeEquals => (location, otherValue) => createBooleanValue(!nativeEquals(location, otherValue));

const methods = {
  asNativeString,
  asNativeBoolean,
  nativeEquals,
  asString: R.pipe(asNativeString, asString),
  asBoolean,
  equals: R.pipe(nativeEquals, equals),
  notEquals: R.pipe(nativeEquals, notEquals),
};

const allMethods = value => Object.keys(methods).reduce((acc, m) => ({ ...acc, [m]: methods[m](value) }), {});

export const createCustomBooleanValue = (value, properties, methods) => createValue(
  valueTypes.BOOLEAN,
  asNativeBoolean(value),
  properties,
  methods,
);

export const createBooleanValue = value => createCustomBooleanValue(value, [], allMethods(value));
