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
import { createValue } from './default';
import { valueTypes, isObject } from './types';

const propertiesAsNativeValues = R.compose(
  R.fromPairs,
  R.map(([key, value]) => ([key, value.asNativeValue()])),
  R.toPairs,
);

const asNativeString = o => () => JSON.stringify(propertiesAsNativeValues(o));

const asNativeBoolean = () => true;

const asNativeObject = o => () => propertiesAsNativeValues(o);

const nativeEquals = o => other => {
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
    return result && o[key].nativeEquals(otherProperties[key]);
  }, true);
};

const asObject = o => () => o;

const getProperty = o => (context, name) => {
  const propertyName = name.asNativeString();
  if (o[propertyName]) {
    return o[propertyName];
  }
  return context.factory.createUndefined();
};

const setProperty = o => (context, name, value) => {
  o[name.asNativeString()] = value;
};

export const createObjectValue = o => createValue(
  valueTypes.OBJECT,
  asNativeObject(o),
  nativeEquals(o),
  nativeEquals(o),
  {},
  {
    asNativeString: asNativeString(o),
    asNativeBoolean,
    asNativeObject: asNativeObject(o),
    asObject: asObject(o),
    getProperty: getProperty(o),
    setProperty: setProperty(o),
  },
);
