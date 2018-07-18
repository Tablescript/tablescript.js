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

import { valueTypes } from './types';
import { createValue } from './default';
import { createStringValue } from './string';
import { createBooleanValue } from './boolean';

const asNativeValue = () => undefined;
const asNativeString = () => 'undefined';
const asNativeBoolean = () => false;
const nativeEquals = (location, other) => other.type === valueTypes.UNDEFINED;
const asString = location => createStringValue(asNativeString(location));
const asBoolean = location => createBooleanValue(asNativeBoolean(location));
const equals = (location, otherValue) => createBooleanValue(nativeEquals(location, otherValue));

export const createUndefined = () => createValue(
  valueTypes.UNDEFINED,
  asNativeValue,
  [],
  {
    asNativeString,
    asNativeBoolean,
    nativeEquals,
    asString,
    asBoolean,
    equals,
  }
);
