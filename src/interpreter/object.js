import { runtimeErrorThrower } from '../error';
import { valueTypes } from './types';
import { createStringValue } from './string';
import { createArrayValue } from './array';
import { createNativeFunctionValue } from './function';
import { createUndefined } from './undefined';

export const createObjectValue = o => {
  const asNativeString = context => JSON.stringify(Object.keys(o).reduce((acc, key) => Object.assign({}, acc, { [key]: o[key].asNativeValue(context) }), {}));
  const asNativeBoolean = () => true;
  const asNativeObject = context => Object.keys(o).reduce((acc, key) => Object.assign({}, acc, { [key]: o[key].asNativeValue(context) }), {});
  const asString = context => createStringValue(asNativeString(context));
  const asBoolean = context => createBooleanValue(asNativeBoolean(context));
  const getProperty = (context, name) => {
    const propertyName = name.asNativeString(context);
    if (members[propertyName]) {
      return members[propertyName];
    }
    if (o[propertyName]) {
      return o[propertyName];
    }
    return createUndefined();
  };
  const setProperty = (context, name, value) => {
    o[name.asNativeString(context)] = value;
  };

  const members = {
    keys: createNativeFunctionValue([], (context, scope) => createArrayValue(Object.keys(o).map(key => createStringValue(key)))),
  };

  return {
    type: valueTypes.OBJECT,
    asNativeValue: asNativeObject,
    asNativeNumber: runtimeErrorThrower('Cannot cast object to number'),
    asNativeString,
    asNativeBoolean,
    asNativeObject,
    equals: runtimeErrorThrower('Object equality unimplemented'),
    asNumber: runtimeErrorThrower('Cannot cast object to number'),
    asString,
    asBoolean,
    getProperty,
    setProperty,
    getProperties: () => o,
    getElement: runtimeErrorThrower('Cannot get element of object'),
    callFunction: runtimeErrorThrower('Cannot call object'),
  };
};
