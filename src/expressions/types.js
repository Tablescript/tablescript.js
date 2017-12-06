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

export const expressionTypes = {
  IF: Symbol('IF'),
  SPREAD: Symbol('SPREAD'),
  UNDEFINED: Symbol('UNDEFINED'),
  STRING: Symbol('STRING'),
  NUMBER: Symbol('NUMBER'),
  DICE: Symbol('DICE'),
  OBJECT_PROPERTY: Symbol('OBJECT_PROPERTY'),
  ARRAY: Symbol('ARRAY'),
  BOOLEAN: Symbol('BOOLEAN'),
  VARIABLE: Symbol('VARIABLE'),
  TABLE: Symbol('TABLE'),
  ASSIGNMENT: Symbol('ASSIGNMENT'),
};

export const expressionTypeName = type => {
  switch (type) {
    case expressionTypes.IF:
      return 'IF';
    case expressionTypes.SPREAD:
      return 'SPREAD';
    case expressionTypes.UNDEFINED:
      return 'UNDEFINED';
    case expressionTypes.STRING:
      return 'STRING';
    case expressionTypes.NUMBER:
      return 'NUMBER';
    case expressionTypes.DICE:
      return 'DICE';
    case expressionTypes.OBJECT_PROPERTY:
      return 'OBJECT_PROPERTY';
    case expressionTypes.ARRAY:
      return 'ARRAY';
    case expressionTypes.BOOLEAN:
      return 'BOOLEAN';
    case expressionTypes.VARIABLE:
      return 'VARIABLE';
    case expressionTypes.TABLE:
      return 'TABLE';
    case expressionTypes.ASSIGNMENT:
      return 'ASSIGNMENT';
    default:
      return '<TYPE UNSET>';
  }
};
