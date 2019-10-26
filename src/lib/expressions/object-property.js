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

import { expressionTypes } from './types';
import {
  createArrayElementLeftHandSideValue,
  createObjectPropertyLeftHandSideValue,
  isArray,
  isNumber,
  isObject,
  isString
} from '../values';
import { throwRuntimeError } from '../error';
import { createExpression } from './default';
import { withSetLocation } from './util/context';

const evaluate = (objectExpression, propertyNameExpression) => context => {
  const objectValue = objectExpression.evaluate(context);
  const propertyNameValue = propertyNameExpression.evaluate(context);
  if (isNumber(propertyNameValue)) {
    return objectValue.getElement(context, propertyNameValue);
  }
  return objectValue.getProperty(context, propertyNameValue);
};

const evaluateAsLeftHandSide = (objectExpression, propertyNameExpression) => context => {
  const objectValue = objectExpression.evaluate(context);
  if (!(isObject(objectValue) || isArray(objectValue))) {
    throwRuntimeError('Cannot assign to non-object non-array type', context);
  }
  const propertyNameValue = propertyNameExpression.evaluate(context);
  if (isNumber(propertyNameValue)) {
    return createArrayElementLeftHandSideValue(objectValue, propertyNameValue);
  }
  if (isString(propertyNameValue)) {
    return createObjectPropertyLeftHandSideValue(objectValue, propertyNameValue);
  }
  throwRuntimeError('Cannot access property or element', context);
};

export const createObjectPropertyExpression = (location, objectExpression, propertyNameExpression) => createExpression(
  expressionTypes.OBJECT_PROPERTY,
  withSetLocation(location, evaluate(objectExpression, propertyNameExpression)),
  withSetLocation(location, evaluateAsLeftHandSide(objectExpression, propertyNameExpression)),
);
