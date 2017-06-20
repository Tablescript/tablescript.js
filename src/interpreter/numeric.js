import { throwRuntimeError, runtimeErrorThrower } from '../error';
import { valueTypes } from './types';
import { createNativeFunctionValue } from './function';
import { createArrayValue } from './array';
import { createUndefined } from './undefined';

export const createNumericValue = value => {
  const asNativeNumber = () => value;
  const asNativeString = () => value.toString();
  const asNativeBoolean = () => value == 0 ? false : true;
  const equals = (context, other) => value === other.asNativeNumber(context);
  const asNumber = context => createNumericValue(asNativeNumber(context));
  const asString = context => createStringValue(asNativeString(context));
  const asBoolean = context => createBooleanValue(asNativeBoolean(context));
  const getProperty = (context, name) => {
    const nameValue = name.asNativeString(context);
    if (members[nameValue]) {
      return members[nameValue];
    }
    return createUndefined();
  };

  const members = {
    upto: createNativeFunctionValue(['end'], (context, scope) => {
      const endValue = scope['end'];
      if (!endValue) {
        throwRuntimeError('upto(n) takes 1 numeric parameter', context);
      }
      const result = [];
      for (let i = value; i < endValue.asNativeNumber(context); i++) {
        result.push(createNumericValue(i));
      }
      return createArrayValue(result);
    }),
  };

  return {
    type: valueTypes.NUMBER,
    asNativeValue: asNativeNumber,
    asNativeNumber,
    asNativeString,
    asNativeBoolean,
    equals,
    asNumber,
    asString,
    asBoolean,
    getProperty,
    setProperty: runtimeErrorThrower('Cannot set property on numeric'),
    getElement: runtimeErrorThrower('Cannot get element of numeric'),
    callFunction: runtimeErrorThrower('Cannot call numeric'),
  };
};
