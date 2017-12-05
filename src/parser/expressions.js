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

import { throwRuntimeError } from '../error';
import { defaultExpression } from './default-expression';
import { expressionTypes } from './expression-types';
import { valueTypes } from '../interpreter/types';
import { createStringValue } from '../interpreter/string';
import { createNumericValue } from '../interpreter/numeric';
import {
  createLeftHandSideValue,
  createArrayElementLeftHandSideValue,
  createObjectPropertyLeftHandSideValue,
} from '../interpreter/left-hand-side';
import { createUndefined } from '../interpreter/undefined';
import { createBooleanValue } from '../interpreter/boolean';
import { createFunctionValue } from '../interpreter/function';
import { createTableValue } from '../interpreter/table';
import { createObjectValue } from '../interpreter/object';
import { createArrayValue } from '../interpreter/array';
import { createArraySpread, createObjectSpread } from '../interpreter/spread';
import { rollDice } from '../interpreter/random';

export const createAssignmentExpression = (context, leftHandSideExpression, valueExpression) => {
  const evaluate = async scope => {
    const leftHandSideValue = await leftHandSideExpression.evaluateAsLeftHandSide(context, scope);
    if (leftHandSideValue.type !== valueTypes.LEFT_HAND_SIDE) {
      throwRuntimeError('Cannot assign to a non-left-hand-side type', context);
    }
    const value = await valueExpression.evaluate(scope);
    leftHandSideValue.assignFrom(context, scope, value);
    return value;
  };

  const getReferencedSymbols = () => {
    return [
      ...leftHandSideExpression.getReferencedSymbols(),
      ...valueExpression.getReferencedSymbols(),
    ];
  };

  return {
    evaluate,
    evaluateAsLeftHandSide: () => {
      throwRuntimeError('Cannot assign to assignment expression', context);
    },
    getReferencedSymbols,
  };
};

export const createPlusEqualsExpression = (context, leftHandSideExpression, valueExpression) => {
  const evaluate = async scope => {
    const leftHandSideValue = await leftHandSideExpression.evaluateAsLeftHandSide(context, scope);
    if (leftHandSideValue.type !== valueTypes.LEFT_HAND_SIDE) {
      throwRuntimeError('Cannot assign to a non-left-hand-side type', context);
    }
    const leftValue = await leftHandSideExpression.evaluate(scope);
    const rightValue = await valueExpression.evaluate(scope);
    if (leftValue.type === valueTypes.STRING) {
      leftHandSideValue.assignFrom(context, scope, createStringValue(leftValue.asNativeString(context) + rightValue.asNativeString(context)));
      return rightValue;
    } else if (leftValue.type === valueTypes.NUMBER) {
      leftHandSideValue.assignFrom(context, scope, createNumericValue(leftValue.asNativeNumber(context) + rightValue.asNativeNumber(context)));
      return rightValue;
    }
    throwRuntimeError('Cannot add these values', context);
  };

  const getReferencedSymbols = () => {
    return [
      ...leftHandSideExpression.getReferencedSymbols(),
      ...valueExpression.getReferencedSymbols(),
    ];
  };

  return {
    evaluate,
    evaluateAsLeftHandSide: () => {
      throwRuntimeError('Cannot assign to assignment expression', context);
    },
    getReferencedSymbols,
  };
};

export const createConditionalExpression = (context, testExpression, consequentExpression, alternateExpression) => {
  return {
    evaluate: async scope => {
      const testValue = await testExpression.evaluate(scope);
      if (testValue.asNativeBoolean(context)) {
        return await consequentExpression.evaluate(scope);
      } else {
        return await alternateExpression.evaluate(scope);
      }
    },
    evaluateAsLeftHandSide: () => {
      throwRuntimeError('Cannot assign to conditional expression', context);
    },
    getReferencedSymbols: () => {
      return [
        ...testExpression.getReferencedSymbols(),
        ...consequentExpression.getReferencedSymbols(),
        ...alternateExpression.getReferencedSymbols(),
      ];
    },
  };
};

export const createBinaryExpression = (context, leftExpression, operator, rightExpression) => {
  const operations = {
    'or': async (scope, leftExpression, rightExpression) => {
      const leftValue = await leftExpression.evaluate(scope);
      if (leftValue.asNativeBoolean(context)) {
        return createBooleanValue(true);
      }
      const rightValue = await rightExpression.evaluate(scope);
      return createBooleanValue(rightValue.asNativeBoolean(context));
    },
    'and': async (scope, leftExpression, rightExpression) => {
      const leftValue = await leftExpression.evaluate(scope);
      if (!leftValue.asNativeBoolean(context)) {
        return createBooleanValue(false);
      }
      const rightValue = await rightExpression.evaluate(scope);
      return createBooleanValue(rightValue.asNativeBoolean(context));
    },
    '+': async (scope, leftExpression, rightExpression) => {
      const leftValue = await leftExpression.evaluate(scope);
      const rightValue = await rightExpression.evaluate(scope);
      if (leftValue.type === valueTypes.STRING) {
        return createStringValue(leftValue.asNativeString(context) + rightValue.asNativeString(context));
      } else if (leftValue.type === valueTypes.NUMBER) {
        return createNumericValue(leftValue.asNativeNumber(context) + rightValue.asNativeNumber(context));
      }
      throwRuntimeError('Cannot add these values', context);
    },
    '-': async (scope, leftExpression, rightExpression) => {
      const leftValue = await leftExpression.evaluate(scope);
      const rightValue = await rightExpression.evaluate(scope);
      return createNumericValue(leftValue.asNativeNumber(context) - rightValue.asNativeNumber(context));
    },
    '*': async (scope, leftExpression, rightExpression) => {
      const leftValue = await leftExpression.evaluate(scope);
      const rightValue = await rightExpression.evaluate(scope);
      return createNumericValue(leftValue.asNativeNumber(context) * rightValue.asNativeNumber(context));
    },
    '/': async (scope, leftExpression, rightExpression) => {
      const leftValue = await leftExpression.evaluate(scope);
      const rightValue = await rightExpression.evaluate(scope);
      if (rightValue.asNativeNumber(context) === 0) {
        throwRuntimeError('Divide by zero', context);
      }
      return createNumericValue(leftValue.asNativeNumber(context) / rightValue.asNativeNumber(context));
    },
    '%': async (scope, leftExpression, rightExpression) => {
      const leftValue = await leftExpression.evaluate(scope);
      const rightValue = await rightExpression.evaluate(scope);
      if (rightValue.asNativeNumber(context) === 0) {
        throwRuntimeError('Divide by zero', context);
      }
      return createNumericValue(leftValue.asNativeNumber(context) % rightValue.asNativeNumber(context));
    },
    '==': async (scope, leftExpression, rightExpression) => {
      const leftValue = await leftExpression.evaluate(scope);
      const rightValue = await rightExpression.evaluate(scope);
      return createBooleanValue(leftValue.equals(context, rightValue));
    },
    '!=': async (scope, leftExpression, rightExpression) => {
      const leftValue = await leftExpression.evaluate(scope);
      const rightValue = await rightExpression.evaluate(scope);
      return createBooleanValue(!leftValue.equals(context, rightValue));
    },
    '<': async (scope, leftExpression, rightExpression) => {
      const leftValue = await leftExpression.evaluate(scope);
      const rightValue = await rightExpression.evaluate(scope);
      return createBooleanValue(leftValue.asNativeNumber(context) < rightValue.asNativeNumber(context));
    },
    '>': async (scope, leftExpression, rightExpression) => {
      const leftValue = await leftExpression.evaluate(scope);
      const rightValue = await rightExpression.evaluate(scope);
      return createBooleanValue(leftValue.asNativeNumber(context) > rightValue.asNativeNumber(context));
    },
    '<=': async (scope, leftExpression, rightExpression) => {
      const leftValue = await leftExpression.evaluate(scope);
      const rightValue = await rightExpression.evaluate(scope);
      return createBooleanValue(leftValue.asNativeNumber(context) <= rightValue.asNativeNumber(context));
    },
    '>=': async (scope, leftExpression, rightExpression) => {
      const leftValue = await leftExpression.evaluate(scope);
      const rightValue = await rightExpression.evaluate(scope);
      return createBooleanValue(leftValue.asNativeNumber(context) >= rightValue.asNativeNumber(context));
    },
  };

  return {
    evaluate: async scope => {
      if (operations[operator]) {
        return await operations[operator](scope, leftExpression, rightExpression);
      }
      throwRuntimeError(`Invalid operator ${operator}`, context);
    },
    evaluateAsLeftHandSide: () => {
      throwRuntimeError('Cannot assign to binary expression', context);
    },
    getReferencedSymbols: () => {
      return [
        ...leftExpression.getReferencedSymbols(),
        ...rightExpression.getReferencedSymbols(),
      ];
    },
  };
};

export const createUnaryExpression = (context, operator, argument) => {
  return {
    evaluate: async scope => {
      const value = await argument.evaluate(scope);
      if (operator === '-') {
        return createNumericValue(-1 * value.asNativeNumber(context));
      } else if (operator === '+') {
        return createNumericValue(value.asNativeNumber(context));
      } else if (operator === 'not') {
        return createBooleanValue(!value.asNativeBoolean(context));
      } else {
        throwRuntimeError(`Invalid operator ${operator}`, context);
      }
    },
    evaluateAsLeftHandSide: () => {
      throwRuntimeError('Cannot assign to unary expression', context);
    },
    getReferencedSymbols: () => argument.getReferencedSymbols(),
  };
};

export const createCallExpression = (context, callee, parameters) => {
  const evaluateParameters = async (parameters, scope) => {
    let result = []
    for (let i = 0; i < parameters.length; i++) {
      result = [
        ...result,
        await parameters[i].evaluate(scope)
      ];
    }
    return result;
  };

  const evaluate = async scope => {
    const calleeValue = await callee.evaluate(scope);
    const parameterValues = await evaluateParameters(parameters, scope);
    return await calleeValue.callFunction(context, scope, parameterValues);
  };

  return {
    evaluate,
    evaluateAsLeftHandSide: () => {
      throwRuntimeError('Cannot assign to call expression', context);
    },
    getReferencedSymbols: () => {
      return [
        ...callee.getReferencedSymbols(),
        ...parameters.reduce((result, parameter) => [...result, ...parameter.getReferencedSymbols()], []),
      ];
    },
  };
};

export const createObjectPropertyExpression = (context, objectExpression, propertyNameExpression) => {
  return {
    evaluate: async scope => {
      const objectValue = await objectExpression.evaluate(scope);
      const propertyNameValue = await propertyNameExpression.evaluate(scope);
      if (propertyNameValue.type === valueTypes.NUMBER) {
        return await objectValue.getElement(context, propertyNameValue);
      }
      return objectValue.getProperty(context, propertyNameValue);
    },
    evaluateAsLeftHandSide: async (context, scope) => {
      const objectValue = await objectExpression.evaluate(scope);
      if (!(objectValue.type === valueTypes.OBJECT || objectValue.type === valueTypes.ARRAY)) {
        throwRuntimeError('Cannot assign to non-object non-array type', context);
      }
      const propertyNameValue = await propertyNameExpression.evaluate(scope);
      if (propertyNameValue.type === valueTypes.NUMBER) {
        return createArrayElementLeftHandSideValue(objectValue, propertyNameValue);
      } else if (propertyNameValue.type === valueTypes.STRING) {
        return createObjectPropertyLeftHandSideValue(objectValue, propertyNameValue);
      } else {
        throwRuntimeError('Cannot access property or element', context);
      }
    },
    getReferencedSymbols: () => {
      return [
        ...objectExpression.getReferencedSymbols(),
        ...propertyNameExpression.getReferencedSymbols(),
      ];
    },
  };
};

export const createFunctionExpression = (context, formalParameters, body) => {
  const createClosure = (body, parameters, scope) => {
    return body.getReferencedSymbols()
      .filter(v => !formalParameters.includes(v))
      .reduce((result, symbol) => ({...result, [symbol]: scope[symbol] }), {});
  };

  return {
    evaluate: scope => {
      return createFunctionValue(formalParameters, body, createClosure(body, formalParameters, scope));
    },
    evaluateAsLeftHandSide: () => {
      throwRuntimeError('Cannot assign to function', context);
    },
    getReferencedSymbols: () => body.getReferencedSymbols(),
  };
};

export const createTableExpression = (context, parameters, entries) => {

  const evaluate = scope => createTableValue(parameters, entries);

  const getReferencedSymbols = () => ([
    ...parameters.reduce((result, parameter) => [...result, ...parameter.getReferencedSymbols()], []),
    ...entries.reduce((result, entry) => [...result, ...entry.getReferencedSymbols()], []),
  ]);

  return {
    ...defaultExpression(expressionTypes.TABLE, evaluate, getReferencedSymbols),
  };
};

export const createTableEntry = (selector, body) => {
  return {
    evaluate: async scope => {
      return await body.evaluate(scope);
    },
    getReferencedSymbols: () => body.getReferencedSymbols(),
    getHighestSelector: () => selector.highestSelector,
    rollApplies: actualRoll => selector.rollApplies(actualRoll),
  };
};

export const createNextTableEntry = body => {
  return {
    evaluate: async scope => {
      return await body.evaluate(scope);
    },
    getReferencedSymbols: () => body.getReferencedSymbols(),
    getHighestSelector: index => (index + 1),
    rollApplies: (actualRoll, index) => (actualRoll === index + 1),
  };
};

export const createRangeTableSelector = (rangeStart, rangeEnd) => {
  return {
    highestSelector: rangeEnd,
    rollApplies: actualRoll => actualRoll >= rangeStart && actualRoll <= rangeEnd,
  };
};

export const createExactTableSelector = roll => {
  return {
    highestSelector: roll,
    rollApplies: actualRoll => actualRoll === roll,
  };
};

export const createVariableExpression = (context, name) => {

  const evaluate = scope => {
    if (scope[name]) {
      return scope[name];
    }
    throwRuntimeError(`Symbol '${name}' not found`, context);
  };

  const evaluateAsLeftHandSide = () => createLeftHandSideValue(name);

  const getReferencedSymbols = () => [name];

  return {
    ...defaultExpression(expressionTypes.VARIABLE, evaluate, getReferencedSymbols),
    evaluateAsLeftHandSide,
  };
};

export const createBooleanLiteral = (context, value) => {

  const evaluate = scope => createBooleanValue(value);

  const getReferencedSymbols = () => [];

  return {
    ...defaultExpression(expressionTypes.BOOLEAN, evaluate, getReferencedSymbols),
  };
};

export const createArrayLiteral = (context, values) => {

  const evaluate = async scope => {
    let result = [];
    for (let i = 0; i < values.length; i++) {
      const value = await values[i].evaluate(scope);
      if (value.type === valueTypes.ARRAY_SPREAD) {
        result = [
          ...result,
          ...value.asArray(context)
        ];
      } else if (value.type === valueTypes.OBJECT_SPREAD) {
        throwRuntimeError('Cannot spread object into array', context);
      } else {
        result = [
          ...result,
          value
        ];
      }
    }
    return createArrayValue(result);
  };

  const getReferencedSymbols = () => values.reduce((result, value) => [...result, ...value.getReferencedSymbols()], []);

  return {
    ...defaultExpression(expressionTypes.ARRAY, evaluate, getReferencedSymbols),
  };
};

export const createObjectLiteral = (context, entries) => {

  const evaluate = async scope => {
    let result = {};
    for (let i = 0; i < entries.length; i++) {
      const value = await entries[i].evaluate(scope);
      result = {
        ...result,
        ...value.asObject(),
      };
    }
    return createObjectValue(result);
  };

  const getReferencedSymbols = () => entries.reduce((result, e) => [...result, e.getReferencedSymbols()], []);

  return {
    ...defaultExpression(expressionTypes.OBJECT, evaluate, getReferencedSymbols),
  };
};

export const createObjectLiteralPropertyExpression = (context, key, value) => {

  const evaluate = async scope => createObjectValue({
    [key]: await value.evaluate(scope),
  });

  const getReferencedSymbols = () => value.getReferencedSymbols();

  return {
    ...defaultExpression(expressionTypes.OBJECT_PROPERTY, evaluate, getReferencedSymbols),
  };
};

export const createDiceLiteral = (context, count, die) => {

  const evaluate = scope => createNumericValue(rollDice(count, die));

  const getReferencedSymbols = () => [];

  return {
    ...defaultExpression(expressionTypes.DICE, evaluate, getReferencedSymbols),
  };
};

export const createNumberLiteral = (context, n) => {
  const evaluate = scope => createNumericValue(n);

  const getReferencedSymbols = () => [];

  return {
    ...defaultExpression(expressionTypes.NUMBER, evaluate, getReferencedSymbols),
  };
};

export const createStringLiteral = (context, s) => {

  const evaluate = scope => createStringValue(s);

  const getReferencedSymbols = () => [];

  return {
    ...defaultExpression(expressionTypes.STRING, evaluate, getReferencedSymbols),
  };
};

export const createIfExpression = (context, condition, ifBlock, elseBlock) => {

  const evaluate = async scope => {
    const expressionValue = await condition.evaluate(scope);
    if (expressionValue.asNativeBoolean(context)) {
      return await ifBlock.evaluate(scope);
    } else {
      if (elseBlock) {
        return await elseBlock.evaluate(scope);
      }
      return createUndefined();
    }
  };

  const getReferencedSymbols = () => {
    return [
      ...condition.getReferencedSymbols(),
      ...ifBlock.getReferencedSymbols(),
      ...(elseBlock ? elseBlock.getReferencedSymbols() : []),
    ];
  };

  return {
    ...defaultExpression(expressionTypes.IF, evaluate, getReferencedSymbols),
  };
};

export const createSpreadExpression = (context, expression) => {

  const evaluate = async scope => {
    const value = await expression.evaluate(scope);
    if (value.type === valueTypes.ARRAY) {
      return createArraySpread(value);
    } else if (value.type === valueTypes.OBJECT) {
      return createObjectSpread(value);
    }
    throwRuntimeError('Spreads only apply to arrays and objects', context);
  };

  const getReferencedSymbols = () => expression.getReferencedSymbols();

  return {
    ...defaultExpression(expressionTypes.SPREAD, evaluate, getReferencedSymbols),
  };
};

export const createUndefinedLiteral = context => {

  const evaluate = () => createUndefined();

  const getReferencedSymbols = () => [];

  return {
    ...defaultExpression(expressionTypes.UNDEFINED, evaluate, getReferencedSymbols),
  };
};
