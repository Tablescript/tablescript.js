import { throwRuntimeError, runtimeErrorThrower } from '../error';
import { valueTypes } from './types';
import { createNativeFunctionValue } from './function';
import { createNumericValue } from './numeric';
import { createBooleanValue } from './boolean';
import { createStringValue } from './string';
import { createUndefined } from './undefined';

export const createArrayValue = entries => {
  const asNativeString = context => JSON.stringify(entries.map(e => e.asNativeValue(context)));
  const asNativeBoolean = () => true;
  const asNativeArray = context => entries.map(e => e.asNativeValue(context));
  const asString = context => createStringValue(asNativeString(context));
  const asBoolean = context => createBooleanValue(asNativeBoolean(context));

  const getProperty = (context, name) => {
    const nameValue = name.asNativeString(context);
    if (members[nameValue]) {
      return members[nameValue];
    }
    return createUndefined();
  };

  const setProperty = (context, index, value) => {
    let indexValue = index.asNativeNumber(context);
    if (indexValue < 0) {
      indexValue = entries.length + indexValue;
    }
    if (indexValue < 0 || indexValue >= entries.length) {
      throwRuntimeError('Index out of range', context);
    }
    entries[indexValue] = value;
    return value;
  };

  const getElement = (context, index) => {
    let indexValue = index.asNativeNumber(context);
    if (indexValue < 0) {
      indexValue = entries.length + indexValue;
    }
    if (indexValue < 0 || indexValue >= entries.length) {
      return createUndefined();
    }
    return entries[indexValue];
  };

  const reduce = createNativeFunctionValue(['reducer', 'initialValue'], (context, scope) => {
    const reducer = scope['reducer'];
    const initialValue = scope['initialValue'];
    let result = initialValue;
    for (let i = 0; i < entries.length; i++) {
      result = reducer.callFunction(context, scope, [result, entries[i]]);
    }
    return result;
  });

  const map = createNativeFunctionValue(['f'], (context, scope) => {
    const f = scope['f'];
    const result = [];
    for (let i = 0; i < entries.length; i++) {
      result.push(f.callFunction(context, scope, [entries[i]]));
    }
    return createArrayValue(result);
  });

  const filter = createNativeFunctionValue(['f'], (context, scope) => {
    const f = scope['f'];
    const result = [];
    for (let i = 0; i < entries.length; i++) {
      const testValue = f.callFunction(context, scope, [entries[i]]);
      if (testValue.asNativeBoolean(context)) {
        result.push(entries[i]);
      }
    }
    return createArrayValue(result);
  });

  const includes = createNativeFunctionValue(['value'], (context, scope) => {
    const value = scope['value'];
    if (value) {
      return createBooleanValue(entries.reduce((result, entry) => result || entry.equals(context, value), false));
    }
    return createUndefined();
  });

  const members = {
    reduce,
    map,
    filter,
    includes,
    length: createNumericValue(entries.length),
  };

  return {
    type: valueTypes.ARRAY,
    asNativeValue: asNativeArray,
    asNativeNumber: runtimeErrorThrower('Cannot cast array to number'),
    asNativeString,
    asNativeBoolean,
    asNativeArray,
    equals: runtimeErrorThrower('Array equality unimplemented'),
    asNumber: runtimeErrorThrower('Cannot cast array to number'),
    asString,
    asBoolean,
    getProperty,
    setProperty,
    getProperties: runtimeErrorThrower('Cannot get properties of array'),
    getElement,
    getElements: () => entries,
    callFunction: runtimeErrorThrower('Cannot call array'),
  };
};
