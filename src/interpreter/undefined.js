import { valueTypes } from './types';
import { runtimeErrorThrower } from '../error';
import { createStringValue } from './string';
import { createBooleanValue } from './boolean';

export const createUndefined = () => {
  const asNativeValue = () => undefined;
  const asNativeString = () => 'undefined';
  const asNativeBoolean = () => false;
  const asString = context => createStringValue(asNativeString(context));
  const asBoolean = context => createBooleanValue(asNativeBoolean(context));

  return {
    type: valueTypes.UNDEFINED,
    asNativeValue,
    asNativeNumber: runtimeErrorThrower('Cannot cast undefined to numeric'),
    asNativeString,
    asNativeBoolean,
    equals: (context, other) => other.type === valueTypes.UNDEFINED,
    asNumber: runtimeErrorThrower('Cannot cast undefined to numeric'),
    asString,
    asBoolean,
    getProperty: runtimeErrorThrower('Cannot get property of undefined'),
    setProperty: runtimeErrorThrower('Cannot set property of undefined'),
    getElement: runtimeErrorThrower('Cannot get element of undefined'),
    callFunction: runtimeErrorThrower('Cannot call undefined'),
  };
};
