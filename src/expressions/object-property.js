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

import { expressionTypes } from './types';
import { isArray, isNumber, isObject, isString } from '../values/types';
import {
  createArrayElementLeftHandSideValue,
  createObjectPropertyLeftHandSideValue
} from '../values/left-hand-side';
import { throwRuntimeError } from '../error';
import { createExpression } from './default';
import { updateStack } from '../context';

const evaluate = (location, objectExpression, propertyNameExpression) => async context => {
  const localContext = updateStack(context, location);
  const objectValue = await objectExpression.evaluate(localContext);
  const propertyNameValue = await propertyNameExpression.evaluate(localContext);
  if (isNumber(propertyNameValue)) {
    return await objectValue.getElement(localContext, propertyNameValue);
  }
  return objectValue.getProperty(localContext, propertyNameValue);
};

const evaluateAsLeftHandSide = (location, objectExpression, propertyNameExpression) => async context => {
  const localContext = updateStack(context, location);
  const objectValue = await objectExpression.evaluate(localContext);
  if (!(isObject(objectValue) || isArray(objectValue))) {
    throwRuntimeError('Cannot assign to non-object non-array type', localContext);
  }
  const propertyNameValue = await propertyNameExpression.evaluate(localContext);
  if (isNumber(propertyNameValue)) {
    return createArrayElementLeftHandSideValue(objectValue, propertyNameValue);
  }
  if (isString(propertyNameValue)) {
    return createObjectPropertyLeftHandSideValue(objectValue, propertyNameValue);
  }
  throwRuntimeError('Cannot access property or element', localContext);
};

export const createObjectPropertyExpression = (location, objectExpression, propertyNameExpression) => createExpression(
  expressionTypes.OBJECT_PROPERTY,
  evaluate(location, objectExpression, propertyNameExpression),
  evaluateAsLeftHandSide(location, objectExpression, propertyNameExpression),
);
