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
  UNARY: Symbol('UNARY'),
  BINARY: Symbol('BINARY'),
  CONDITIONAL: Symbol('CONDITIONAL'),
};

export const expressionTypeName = type => {
  switch (type) {
    case expressionTypes.IF:
      return 'if';
    case expressionTypes.SPREAD:
      return 'spread';
    case expressionTypes.UNDEFINED:
      return 'undefined';
    case expressionTypes.STRING:
      return 'string';
    case expressionTypes.NUMBER:
      return 'number';
    case expressionTypes.DICE:
      return 'dice';
    case expressionTypes.OBJECT_PROPERTY:
      return 'object property';
    case expressionTypes.ARRAY:
      return 'array';
    case expressionTypes.BOOLEAN:
      return 'boolean';
    case expressionTypes.VARIABLE:
      return 'variable';
    case expressionTypes.TABLE:
      return 'table';
    case expressionTypes.ASSIGNMENT:
      return 'assignment';
    case expressionTypes.UNARY:
      return 'unary';
    case expressionTypes.BINARY:
      return 'binary';
    case expressionTypes.CONDITIONAL:
      return 'conditional';
    default:
      return '<TYPE UNSET>';
  }
};
