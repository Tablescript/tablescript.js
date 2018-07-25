import { createArrayValue } from './array';
import { createBooleanValue } from './boolean';
//import { createNativeFunctionValue, createFunctionValue } from './function';
import { createNumericValue } from './numeric';
//import { createObjectValue } from './object';
import { createStringValue } from './string';
import { createUndefined } from './undefined';

export const valueFactory = {
  createArrayValue,
  createBooleanValue,
//  createNativeFunctionValue,
//  createFunctionValue,
  createNumericValue,
//  createObjectValue,
  createStringValue,
  createUndefined,
};
