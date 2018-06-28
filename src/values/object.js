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
import { createStringValue } from './string';
import { createBooleanValue } from './boolean';
import { createUndefined } from './undefined';

export const createObjectValue = o => {
  const propertiesAsNativeValues = (context, properties) => {
    return Object.keys(properties).reduce((result, key) => ({
      ...result,
      [key]: properties[key].asNativeValue(context)
    }), {});
  };

  const asNativeString = context => JSON.stringify(propertiesAsNativeValues(context, o));
  const asNativeBoolean = () => true;
  const asNativeObject = context => propertiesAsNativeValues(context, o);
  const nativeEquals = (context, other) => {
    if (other.type !== valueTypes.OBJECT) {
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

  const asString = context => createStringValue(asNativeString(context));
  const asBoolean = () => createBooleanValue(asNativeBoolean());
  const asObject = () => o;
  const getProperty = (context, name) => {
    const propertyName = name.asNativeString(context);
    if (o[propertyName]) {
      return o[propertyName];
    }
    return createUndefined();
  };
  const setProperty = (context, name, value) => {
    o[name.asNativeString(context)] = value;
  };
  const equals = (context, otherValue) => {
    return createBooleanValue(nativeEquals(context, otherValue));
  };

  return {
    ...defaultValue(valueTypes.OBJECT, asNativeObject),
    asNativeString,
    asNativeBoolean,
    asNativeObject,
    nativeEquals,
    asString,
    asBoolean,
    asObject,
    getProperty,
    setProperty,
    equals,
  };
};
