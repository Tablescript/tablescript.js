import { requiredParameter, optionalParameter } from '../../util/parameters';
import { throwRuntimeError } from '../../error';
import { isString, isNumber, isArray, isObject } from '../types';

export const withRequiredParameter = parameter => f => (context, ...args) => f(context, requiredParameter(context, parameter), ...args);

const withRequiredTypedParameter = (validator, type) => (parameter, msg) => f => (context, ...args) => {
  const value = requiredParameter(context, parameter);
  if (!validator(value)) {
    throwRuntimeError(`${msg} ${parameter} must be ${type}`);
  }
  return f(context, value, ...args);
};

export const withRequiredNumericParameter = withRequiredTypedParameter(isNumber, 'a number');
export const withRequiredArrayParameter = withRequiredTypedParameter(isArray, 'an array');
export const withRequiredObjectParameter = withRequiredTypedParameter(isObject, 'an object');

export const withOptionalParameter = parameter => f => (context, ...args) => f(context, optionalParameter(context, parameter), ...args);

export const withOptionalStringParameter = (parameter, msg) => f => (context, ...args) => {
  const value = optionalParameter(context, parameter);
  if (value && !isString(value)) {
    throwRuntimeError(`${msg} must be a string`, context);
  }
  return f(context, value, ...args);
};

export const withOptionalNumericParameter = (parameter, msg) => f => (context, ...args) => {
  const value = optionalParameter(context, parameter);
  if (value && !isNumber(value)) {
    throwRuntimeError(`${msg} must be a number`, context);
  }
  return f(context, value, ...args);
};

export const withNumericResult = f => (context, ...args) => context.factory.createNumericValue(f(context, ...args));

export const withBooleanResult = f => (context, ...args) => context.factory.createBooleanValue(f(context, ...args));

export const withArrayResult = f => (context, ...args) => context.factory.createArrayValue(f(context, ...args));

export const withStringResult = f => (context, ...args) => context.factory.createStringValue(f(context, ...args));
