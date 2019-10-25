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

export const expressionTypes = {
  ARRAY: Symbol('ARRAY'),
  ASSIGNMENT: Symbol('ASSIGNMENT'),
  BINARY: Symbol('BINARY'),
  BOOLEAN: Symbol('BOOLEAN'),
  BLOCK: Symbol('BLOCK'),
  CALL: Symbol('CALL'),
  COMPOUND: Symbol('COMPOUND'),
  COMPOUND_STRING: Symbol('COMPOUND_STRING'),
  CONDITIONAL: Symbol('CONDITIONAL'),
  DICE: Symbol('DICE'),
  FOR: Symbol('FOR'),
  FUNCTION: Symbol('FUNCTION'),
  IF: Symbol('IF'),
  NUMBER: Symbol('NUMBER'),
  OBJECT: Symbol('OBJECT'),
  OBJECT_PROPERTY: Symbol('OBJECT_PROPERTY'),
  SPREAD: Symbol('SPREAD'),
  STRING: Symbol('STRING'),
  TABLE: Symbol('TABLE'),
  TEMPLATE_STRING: Symbol('TEMPLATE_STRING'),
  UNARY: Symbol('UNARY'),
  UNDEFINED: Symbol('UNDEFINED'),
  UNTIL: Symbol('UNTIL'),
  VARIABLE: Symbol('VARIABLE'),
  WHILE: Symbol('WHILE'),
};

export const expressionTypeName = type => {
  switch (type) {
    case expressionTypes.ARRAY:
      return 'array';
    case expressionTypes.ASSIGNMENT:
      return 'assignment';
    case expressionTypes.BINARY:
      return 'binary';
    case expressionTypes.BLOCK:
      return 'block';
    case expressionTypes.BOOLEAN:
      return 'boolean';
    case expressionTypes.CALL:
      return 'call';
    case expressionTypes.COMPOUND:
      return 'compound';
    case expressionTypes.COMPOUND_STRING:
      return 'compound string';
    case expressionTypes.CONDITIONAL:
      return 'conditional';
    case expressionTypes.DICE:
      return 'dice';
    case expressionTypes.FOR:
      return 'for';
    case expressionTypes.FUNCTION:
      return 'funtion';
    case expressionTypes.IF:
      return 'if';
    case expressionTypes.NUMBER:
      return 'number';
    case expressionTypes.OBJECT:
      return 'object';
    case expressionTypes.OBJECT_PROPERTY:
      return 'object property';
    case expressionTypes.SPREAD:
      return 'spread';
    case expressionTypes.STRING:
      return 'string';
    case expressionTypes.TABLE:
      return 'table';
    case expressionTypes.TEMPLATE_STRING:
      return 'string';
    case expressionTypes.UNARY:
      return 'unary';
    case expressionTypes.UNDEFINED:
      return 'undefined';
    case expressionTypes.UNTIL:
      return 'until';
    case expressionTypes.VARIABLE:
      return 'variable';
    case expressionTypes.WHILE:
      return 'while';
    default:
      return '<TYPE UNSET>';
  }
};
