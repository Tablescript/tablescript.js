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
import { valueTypes, isObject } from './types';
import { createStringValue } from './string';
import { createBooleanValue } from './boolean';
import { createUndefined } from './undefined';

const propertiesAsNativeValues = (context, properties) => {
  return Object.keys(properties).reduce((result, key) => ({
    ...result,
    [key]: properties[key].asNativeValue(context)
  }), {});
};
const asNativeString = o => context => JSON.stringify(propertiesAsNativeValues(context, o));
const asNativeBoolean = () => () => true;
const asNativeObject = o => context => propertiesAsNativeValues(context, o);
const nativeEquals = o => (context, other) => {
  if (!isObject(other)) {
    return false;
  }
  const otherProperties = other.asObject();
  if (Object.keys(o).length !== Object.keys(otherProperties).length) {
    return false;
  }
  return Object.keys(o).reduce((result, key) => {
    if (!otherProperties[key]) {
      return false;
    }
    return result && o[key].nativeEquals(context, otherProperties[key]);
  }, true);
};
const asString = asNativeString => context => createStringValue(asNativeString(context));
const asBoolean = asNativeBoolean => () => createBooleanValue(asNativeBoolean());
const asObject = o => () => o;
const getProperty = o => (context, name) => {
  const propertyName = name.asNativeString(context);
  if (o[propertyName]) {
    return o[propertyName];
  }
  return createUndefined();
};
const setProperty = o => (context, name, value) => {
  o[name.asNativeString(context)] = value;
};
const equals = nativeEquals => (context, other) => createBooleanValue(nativeEquals(context, other));

const methods = {
  asNativeString,
  asNativeBoolean,
  asNativeObject,
  nativeEquals,
  asString: R.pipe(asNativeString, asString),
  asBoolean: R.pipe(asNativeBoolean, asBoolean),
  asObject,
  getProperty,
  setProperty,
  equals: R.pipe(nativeEquals, equals),
};

const allMethods = o => Object.keys(methods).reduce((acc, m) => ({ ...acc, [m]: methods[m](o) }), {});

export const createCustomObjectValue = (o, methods) => {
  return createValue(
    valueTypes.OBJECT,
    asNativeObject(o),
    [],
    methods,
  );
};

export const createObjectValue = o => createCustomObjectValue(o, allMethods(o));
