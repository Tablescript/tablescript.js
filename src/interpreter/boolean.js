import { runtimeErrorThrower } from '../error';
import { valueTypes } from './types';
import { createNumericValue } from './numeric';
import { createStringValue } from './string';

export const createBooleanValue = value => {
  const asNativeNumber = () => value ? 1 : 0;
  const asNativeString = () => value ? 'true' : 'false';
  const asNativeBoolean = () => value;
  const equals = (context, other) => value === other.asNativeBoolean(context);
  const asNumber = context => createNumericValue(asNativeNumber(context));
  const asString = context => createStringValue(asNativeString(context));
  const asBoolean = () => createBooleanValue(value);

  return {
    type: valueTypes.BOOLEAN,
    asNativeValue: asNativeBoolean,
    asNativeNumber,
    asNativeString,
    asNativeBoolean,
    asNativeArray: runtimeErrorThrower('Cannot convert boolean to array'),
    equals,
    asNumber,
    asString,
    asBoolean,
    getProperty: runtimeErrorThrower('Cannot get property of boolean'),
    setProperty: runtimeErrorThrower('Cannot set property of boolean'),
    getProperties: runtimeErrorThrower('Cannot get properties of boolean'),
    getElement: runtimeErrorThrower('Cannot get element of boolean'),
    getElements: runtimeErrorThrower('Cannot get elements of boolean'),
    callFunction: runtimeErrorThrower('Cannot call boolean'),
  };
};
