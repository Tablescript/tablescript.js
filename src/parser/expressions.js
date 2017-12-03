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
  const evaluate = scope => {
    const leftHandSideValue = leftHandSideExpression.evaluateAsLeftHandSide(scope);
    if (leftHandSideValue.type !== valueTypes.LEFT_HAND_SIDE) {
      throwRuntimeError('Cannot assign to a non-left-hand-side type', context);
    }
    const value = valueExpression.evaluate(scope);
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
  const evaluate = scope => {
    const leftHandSideValue = leftHandSideExpression.evaluateAsLeftHandSide(scope);
    if (leftHandSideValue.type !== valueTypes.LEFT_HAND_SIDE) {
      throwRuntimeError('Cannot assign to a non-left-hand-side type', context);
    }
    const leftValue = leftHandSideExpression.evaluate(scope);
    const rightValue = valueExpression.evaluate(scope);
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
    evaluate: scope => {
      const testValue = testExpression.evaluate(scope);
      if (testValue.asNativeBoolean(context)) {
        return consequentExpression.evaluate(scope);
      } else {
        return alternateExpression.evaluate(scope);
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
    'or': (scope, leftExpression, rightExpression) => {
      const leftValue = leftExpression.evaluate(scope);
      if (leftValue.asNativeBoolean(context)) {
        return createBooleanValue(true);
      }
      return createBooleanValue(rightExpression.evaluate(scope).asNativeBoolean(context));
    },
    'and': (scope, leftExpression, rightExpression) => {
      const leftValue = leftExpression.evaluate(scope);
      if (!leftValue.asNativeBoolean(context)) {
        return createBooleanValue(false);
      }
      return createBooleanValue(rightExpression.evaluate(scope).asNativeBoolean(context));
    },
    '+': (scope, leftExpression, rightExpression) => {
      const leftValue = leftExpression.evaluate(scope);
      const rightValue = rightExpression.evaluate(scope);
      if (leftValue.type === valueTypes.STRING) {
        return createStringValue(leftValue.asNativeString(context) + rightValue.asNativeString(context));
      } else if (leftValue.type === valueTypes.NUMBER) {
        return createNumericValue(leftValue.asNativeNumber(context) + rightValue.asNativeNumber(context));
      }
      throwRuntimeError('Cannot add these values', context);
    },
    '-': (scope, leftExpression, rightExpression) => {
      const leftValue = leftExpression.evaluate(scope);
      const rightValue = rightExpression.evaluate(scope);
      return createNumericValue(leftValue.asNativeNumber(context) - rightValue.asNativeNumber(context));
    },
    '*': (scope, leftExpression, rightExpression) => {
      const leftValue = leftExpression.evaluate(scope);
      const rightValue = rightExpression.evaluate(scope);
      return createNumericValue(leftValue.asNativeNumber(context) * rightValue.asNativeNumber(context));
    },
    '/': (scope, leftExpression, rightExpression) => {
      const leftValue = leftExpression.evaluate(scope);
      const rightValue = rightExpression.evaluate(scope);
      if (rightValue.asNativeNumber(context) === 0) {
        throwRuntimeError('Divide by zero', context);
      }
      return createNumericValue(leftValue.asNativeNumber(context) / rightValue.asNativeNumber(context));
    },
    '%': (scope, leftExpression, rightExpression) => {
      const leftValue = leftExpression.evaluate(scope);
      const rightValue = rightExpression.evaluate(scope);
      if (rightValue.asNativeNumber(context) === 0) {
        throwRuntimeError('Divide by zero', context);
      }
      return createNumericValue(leftValue.asNativeNumber(context) % rightValue.asNativeNumber(context));
    },
    '==': (scope, leftExpression, rightExpression) => {
      const leftValue = leftExpression.evaluate(scope);
      const rightValue = rightExpression.evaluate(scope);
      return createBooleanValue(leftValue.equals(context, rightValue));
    },
    '!=': (scope, leftExpression, rightExpression) => {
      const leftValue = leftExpression.evaluate(scope);
      const rightValue = rightExpression.evaluate(scope);
      return createBooleanValue(!leftValue.equals(context, rightValue));
    },
    '<': (scope, leftExpression, rightExpression) => {
      const leftValue = leftExpression.evaluate(scope);
      const rightValue = rightExpression.evaluate(scope);
      return createBooleanValue(leftValue.asNativeNumber(context) < rightValue.asNativeNumber(context));
    },
    '>': (scope, leftExpression, rightExpression) => {
      const leftValue = leftExpression.evaluate(scope);
      const rightValue = rightExpression.evaluate(scope);
      return createBooleanValue(leftValue.asNativeNumber(context) > rightValue.asNativeNumber(context));
    },
    '<=': (scope, leftExpression, rightExpression) => {
      const leftValue = leftExpression.evaluate(scope);
      const rightValue = rightExpression.evaluate(scope);
      return createBooleanValue(leftValue.asNativeNumber(context) <= rightValue.asNativeNumber(context));
    },
    '>=': (scope, leftExpression, rightExpression) => {
      const leftValue = leftExpression.evaluate(scope);
      const rightValue = rightExpression.evaluate(scope);
      return createBooleanValue(leftValue.asNativeNumber(context) >= rightValue.asNativeNumber(context));
    },
  };

  return {
    evaluate: scope => {
      if (operations[operator]) {
        return operations[operator](scope, leftExpression, rightExpression);
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
    evaluate: scope => {
      const value = argument.evaluate(scope);
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
  return {
    evaluate: scope => {
      const calleeValue = callee.evaluate(scope);
      const parameterValues = parameters.map(p => p.evaluate(scope));
      return calleeValue.callFunction(context, scope, parameterValues);
    },
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
    evaluate: scope => {
      const objectValue = objectExpression.evaluate(scope);
      const propertyNameValue = propertyNameExpression.evaluate(scope);
      if (propertyNameValue.type === valueTypes.NUMBER) {
        return objectValue.getElement(context, propertyNameValue);
      }
      return objectValue.getProperty(context, propertyNameValue);
    },
    evaluateAsLeftHandSide: scope => {
      const objectValue = objectExpression.evaluate(scope);
      if (!(objectValue.type === valueTypes.OBJECT || objectValue.type === valueTypes.ARRAY)) {
        throwRuntimeError('Cannot assign to non-object non-array type', context);
      }
      const propertyNameValue = propertyNameExpression.evaluate(scope);
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
  return {
    evaluate: scope => {
      return createTableValue(parameters, entries);
    },
    evaluateAsLeftHandSide: () => {
      throwRuntimeError('Cannot assign to table', context);
    },
    getReferencedSymbols: () => {
      return [
        ...parameters.reduce((result, parameter) => [...result, ...parameter.getReferencedSymbols()], []),
        ...entries.reduce((result, entry) => [...result, ...entry.getReferencedSymbols()], []),
      ];
    },
  };
};

export const createTableEntry = (selector, body) => {
  return {
    evaluate: scope => {
      return body.evaluate(scope);
    },
    getReferencedSymbols: () => body.getReferencedSymbols(),
    getHighestSelector: () => selector.highestSelector,
    rollApplies: actualRoll => selector.rollApplies(actualRoll),
  };
};

export const createNextTableEntry = body => {
  return {
    evaluate: scope => {
      return body.evaluate(scope);
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
  return {
    evaluate: scope => {
      if (scope[name]) {
        return scope[name];
      }
      throwRuntimeError(`Symbol '${name}' not found`, context);
    },
    evaluateAsLeftHandSide: () => createLeftHandSideValue(name),
    getReferencedSymbols: () => [name],
  };
};

export const createBooleanLiteral = (context, value) => {
  return {
    evaluate: scope => createBooleanValue(value),
    evaluateAsLeftHandSide: () => {
      throwRuntimeError('Cannot assign to boolean', context);
    },
    getReferencedSymbols: () => [],
  };
};

export const createArrayLiteral = (context, values) => {
  return {
    evaluate: scope => createArrayValue(values.reduce((result, v) => {
      const value = v.evaluate(scope);
      if (value.type === valueTypes.ARRAY_SPREAD) {
        return [...result, ...value.getElements(context)];
      } else if (value.type === valueTypes.OBJECT_SPREAD) {
        throwRuntimeError('Cannot spread object into array', context);
      }
      return [...result, value];
    }, [])),
    evaluateAsLeftHandSide: () => {
      throwRuntimeError('Cannot assign to array', context);
    },
    getReferencedSymbols: () => values.reduce((result, value) => [...result, ...value.getReferencedSymbols()], []),
  };
};

export const createObjectLiteral = (context, entries) => {
  return {
    evaluate: scope => {
      return createObjectValue(entries.reduce((result, e) => {
        const value = e.evaluate(scope);
        if (value.type === valueTypes.OBJECT_SPREAD) {
          return {
            ...result,
            ...value.getProperties(context),
          };
        }
        return {
          ...result,
          ...value.getProperties(context),
        };
      }, {}));
    },
    evaluateAsLeftHandSide: () => {
      throwRuntimeError('Cannot assign to an object', context);
    },
    getReferencedSymbols: () => entries.reduce((result, e) => [...result, e.getReferencedSymbols()], []),
  };
};

export const createObjectLiteralPropertyExpression = (context, key, value) => {
  return {
    evaluate: scope => createObjectValue({
      [key]: value.evaluate(scope),
    }),
    evaluateAsLeftHandSide: () => {
      throwRuntimeError('Cannot assign to an object', context);
    },
    getReferencedSymbols: () => value.getReferencedSymbols(),
  };
};

export const createDiceLiteral = (context, count, die) => {
  return {
    evaluate: scope => createNumericValue(rollDice(count, die)),
    evaluateAsLeftHandSide: () => {
      throwRuntimeError('Cannot assign to dice', context);
    },
    getReferencedSymbols: () => [],
  };
};

export const createNumberLiteral = (context, n) => {
  return {
    evaluate: scope => createNumericValue(n),
    evaluateAsLeftHandSide: () => {
      throwRuntimeError('Cannot assign to number', context);
    },
    getReferencedSymbols: () => [],
  };
};

export const createStringLiteral = (context, s) => {
  return {
    evaluate: scope => createStringValue(s),
    evaluateAsLeftHandSide: () => {
      throwRuntimeError('Cannot assign to string', context);
    },
    getReferencedSymbols: () => [],
  };
};

export const createIfExpression = (context, condition, ifBlock, elseBlock) => {
  return {
    evaluate: scope => {
      const expressionValue = condition.evaluate(scope);
      if (expressionValue.asNativeBoolean(context)) {
        return ifBlock.evaluate(scope);
      } else {
        if (elseBlock) {
          return elseBlock.evaluate(scope);
        }
        return createUndefined();
      }
    },
    getReferencedSymbols: () => {
      return [
        ...condition.getReferencedSymbols(),
        ...ifBlock.getReferencedSymbols(),
        ...(elseBlock ? elseBlock.getReferencedSymbols() : []),
      ];
    },
  };
};

export const createSpreadExpression = (context, expression) => {
  return {
    evaluate: scope => {
      const value = expression.evaluate(scope);
      if (value.type === valueTypes.ARRAY) {
        return createArraySpread(value);
      } else if (value.type === valueTypes.OBJECT) {
        return createObjectSpread(value);
      }
      throwRuntimeError('Spreads only apply to arrays and objects', context);
    },
    getReferencedSymbols: () => expression.getReferencedSymbols(),
  };
};
