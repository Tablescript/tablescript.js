import { throwRuntimeError, runtimeErrorThrower } from '../error';
import { valueTypes } from './types';
import { createStringValue } from './string';
import { createBooleanValue } from './boolean';

const validateCalledParameters = (formalParameters, calledParameters) => {
  if (calledParameters.length > formalParameters.length) {
    throwRuntimeError(`function call expected ${formalParameters.length} parameters but got ${calledParameters.length}`);
  }
  return calledParameters;
};

const toKeyValuePair = formalParameters => (value, index) => ({ [formalParameters[index]]: value });
const keyPairsToObject = (result, pair) => Object.assign({}, result, pair);

const parameterConverter = formalParameters => calledParameters => {
  return validateCalledParameters(formalParameters, calledParameters)
    .map(toKeyValuePair(formalParameters))
    .reduce(keyPairsToObject, {});
};

export const createNativeFunctionValue = (formalParameters, f) => {
  const parametersToArguments = parameterConverter(formalParameters);

  const asNativeString = () => 'function(native)';
  const asNativeBoolean = () => true;
  const asString = context => createStringValue(asNativeString(context));
  const asBoolean = context => createBooleanValue(asNativeBoolean(context));
  const equals = other => false;
  const callFunction = (context, scope, parameters) => {
    const localScope = Object.assign({}, scope, parametersToArguments(parameters));
    return f(context, localScope);
  };

  return {
    type: valueTypes.FUNCTION,
    asNativeValue: asNativeString,
    asNativeNumber: runtimeErrorThrower('Cannot cast function to number'),
    asNativeString,
    asNativeBoolean,
    equals,
    asNumber: runtimeErrorThrower('Cannot cast function to number'),
    asString,
    asBoolean,
    getProperty: runtimeErrorThrower('Cannot get property of native function'),
    setProperty: runtimeErrorThrower('Cannot set property of native function'),
    getElement: runtimeErrorThrower('Cannot get element of native function'),
    callFunction,
  };
};

export const createFunctionValue = (formalParameters, body, closure) => {
  const parametersToArguments = parameterConverter(formalParameters);

  const asNativeString = () => 'function';
  const asNativeBoolean = () => true;
  const asString = context => createStringValue(asNativeString(context));
  const asBoolean = context => createBooleanValue(asNativeBoolean(context));
  const equals = other => false;
  const callFunction = (context, scope, parameters) => {
    const localScope = Object.assign({}, scope, closure, parametersToArguments(parameters));
    return body.evaluate(localScope);
  };

  return {
    type: valueTypes.FUNCTION,
    asNativeValue: asNativeString,
    asNativeNumber: runtimeErrorThrower('Cannot cast function to number'),
    asNativeString,
    asNativeBoolean,
    equals,
    asNumber: runtimeErrorThrower('Cannot cast function to number'),
    asString,
    asBoolean,
    getProperty: runtimeErrorThrower('Cannot get property of function'),
    setProperty: runtimeErrorThrower('Cannot set property of function'),
    getElement: runtimeErrorThrower('Cannot get element of function'),
    callFunction,
  };
};
