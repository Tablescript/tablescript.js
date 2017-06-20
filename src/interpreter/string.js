import { throwRuntimeError, runtimeErrorThrower } from '../error';
import { valueTypes } from './types';
import { createBooleanValue } from './boolean';
import { createNumericValue } from './numeric';
import { createUndefined } from './undefined';

export const createStringValue = value => {
  const asNativeNumber = () => Number(value);
  const asNativeString = () => value;
  const asNativeBoolean = () => value === '' ? false : true;
  const equals = (context, other) => value === other.asNativeString(context);
  const asNumber = context => createNumericValue(asNativeNumber(context));
  const asString = context => createStringValue(asNativeString(context));
  const asBoolean = context => createBooleanValue(asNativeBoolean(context));
  const getProperty = (context, name) => {
    const nameValue = name.asNativeString(context);
    if (members[nameValue]) {
      return members[nameValue];
    }
    throwRuntimeError(`String has no member ${nameValue}`, context);
  };
  const getElement = (context, index) => {
    let indexValue = index.asNativeNumber(context);
    if (indexValue < 0) {
      indexValue = value.length + indexValue;
    }
    if (indexValue < 0 || indexValue >= value.length) {
      return createUndefined();
    }
    return createStringValue(value[indexValue]);
  };

  const members = {
    empty: createBooleanValue(value.length === 0),
    length: createNumericValue(value.length),
  };

  return {
    type: valueTypes.STRING,
    asNativeValue: asNativeString,
    asNativeNumber,
    asNativeString,
    asNativeBoolean,
    equals,
    asNumber,
    asString,
    asBoolean,
    getProperty,
    setProperty: runtimeErrorThrower('Cannot set property on string'),
    getElement,
    callFunction: runtimeErrorThrower('Cannot call string'),
  };
};
