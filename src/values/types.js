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

export const valueTypes = {
  NUMBER: Symbol('NUMBER'),
  STRING: Symbol('STRING'),
  FUNCTION: Symbol('FUNCTION'),
  TABLE: Symbol('TABLE'),
  OBJECT: Symbol('OBJECT'),
  ARRAY: Symbol('ARRAY'),
  BOOLEAN: Symbol('BOOLEAN'),
  LEFT_HAND_SIDE: Symbol('LEFT_HAND_SIDE'),
  ARRAY_SPREAD: Symbol('ARRAY_SPREAD'),
  OBJECT_SPREAD: Symbol('OBJECT_SPREAD'),
  UNDEFINED: Symbol('UNDEFINED'),
};

export const valueTypeName = type => {
  switch (type) {
    case valueTypes.NUMBER:
      return 'NUMBER';
    case valueTypes.STRING:
      return 'STRING';
    case valueTypes.FUNCTION:
      return 'FUNCTION';
    case valueTypes.TABLE:
      return 'TABLE';
    case valueTypes.OBJECT:
      return 'OBJECT';
    case valueTypes.ARRAY:
      return 'ARRAY';
    case valueTypes.BOOLEAN:
      return 'BOOLEAN';
    case valueTypes.LEFT_HAND_SIDE:
      return 'LEFT_HAND_SIDE';
    case valueTypes.ARRAY_SPREAD:
      return 'ARRAY_SPREAD';
    case valueTypes.OBJECT_SPREAD:
      return 'OBJECT_SPREAD';
    case valueTypes.UNDEFINED:
      return 'UNDEFINED';
    default:
      return '<TYPE UNSET>';
  }
};
