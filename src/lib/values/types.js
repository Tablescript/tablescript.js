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

export const valueTypes = {
  ARRAY: Symbol('ARRAY'),
  ARRAY_SPREAD: Symbol('ARRAY_SPREAD'),
  BOOLEAN: Symbol('BOOLEAN'),
  FUNCTION: Symbol('FUNCTION'),
  LEFT_HAND_SIDE: Symbol('LEFT_HAND_SIDE'),
  NUMBER: Symbol('NUMBER'),
  OBJECT: Symbol('OBJECT'),
  OBJECT_SPREAD: Symbol('OBJECT_SPREAD'),
  STRING: Symbol('STRING'),
  TABLE: Symbol('TABLE'),
  TABLE_SPREAD: Symbol('TABLE_SPREAD'),
  UNDEFINED: Symbol('UNDEFINED'),
};

export const valueTypeName = type => {
  switch (type) {
    case valueTypes.ARRAY:
      return 'ARRAY';
    case valueTypes.ARRAY_SPREAD:
      return 'ARRAY_SPREAD';
    case valueTypes.BOOLEAN:
      return 'BOOLEAN';
    case valueTypes.FUNCTION:
      return 'FUNCTION';
    case valueTypes.LEFT_HAND_SIDE:
      return 'LEFT_HAND_SIDE';
    case valueTypes.NUMBER:
      return 'NUMBER';
    case valueTypes.OBJECT:
      return 'OBJECT';
    case valueTypes.OBJECT_SPREAD:
      return 'OBJECT_SPREAD';
    case valueTypes.STRING:
      return 'STRING';
    case valueTypes.TABLE:
      return 'TABLE';
    case valueTypes.TABLE_SPREAD:
      return 'TABLE_SPREAD';
    case valueTypes.UNDEFINED:
      return 'UNDEFINED';
    default:
      return '<TYPE UNSET>';
  }
};

const isType = type => o => o.type === type;
export const isArray = isType(valueTypes.ARRAY);
export const isArraySpread = isType(valueTypes.ARRAY_SPREAD);
export const isBoolean = isType(valueTypes.BOOLEAN);
export const isFunction = isType(valueTypes.FUNCTION);
export const isLeftHandSide = isType(valueTypes.LEFT_HAND_SIDE);
export const isNumber = isType(valueTypes.NUMBER);
export const isObject = isType(valueTypes.OBJECT);
export const isObjectSpread = isType(valueTypes.OBJECT_SPREAD);
export const isString = isType(valueTypes.STRING);
export const isTable = isType(valueTypes.TABLE);
export const isTableSpread = isType(valueTypes.TABLE_SPREAD);
export const isUndefined = isType(valueTypes.UNDEFINED);
export const isCallable = o => isFunction(o) || isTable(o);
