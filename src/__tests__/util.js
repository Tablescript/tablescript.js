// Copyright 2019 Jamie Hale
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
import { isBoolean, isNumber, isString, isArray, isUndefined } from '../values/types';

export const booleanValue = expected => value => {
  if (!isBoolean(value)) {
    throw new Error(`Expecting a BOOLEAN but got ${value.type}`);
  }
  const actual = value.asNativeBoolean();
  if (actual !== expected) {
    throw new Error(`Expecting ${expected} but got ${actual}`);
  }
  return true;
};

export const numericValue = expected => value => {
  if (!isNumber(value)) {
    throw new Error(`Expecting a NUMBER but got ${value.type}`);
  }
  const actual = value.asNativeNumber();
  if (actual !== expected) {
    throw new Error(`Expecting ${expected} but got ${actual}`);
  }
  return true;
};

export const stringValue = expected => value => {
  if (!isString(value)) {
    throw new Error(`Expecting a STRING but got ${value.type}`);
  }
  const actual = value.asNativeString();
  if (actual !== expected) {
    throw new Error(`Expecting ${expected} but got ${actual}`);
  }
  return true;
};

export const arrayValue = expected => value => {
  if (!isArray(value)) {
    throw new Error(`Expecting an ARRAY but got ${value.type}`);
  }
  const actual = value.asNativeArray();
  if (!R.equals(actual, expected)) {
    throw new Error(`Expecting ${expected} but got ${actual}`);
  }
  return true;
};

export const undefinedValue = value => {
  if (!isUndefined(value)) {
    throw new Error(`Expecting a UNDEFINED but got ${value.type}`);
  }
  return true;
};
