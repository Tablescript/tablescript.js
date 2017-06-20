import { valueTypes } from './types';
import { runtimeErrorThrower } from '../error';

export const createArraySpread = a => {
  return {
    type: valueTypes.ARRAY_SPREAD,
    asNativeValue: runtimeErrorThrower('Cannot convert spread to native value'),
    asNativeNumber: runtimeErrorThrower('Cannot convert spread to native number'),
    asNativeString: runtimeErrorThrower('Cannot convert spread to native string'),
    asNativeBoolean: runtimeErrorThrower('Cannot convert spread to native boolean'),
    asNativeArray: runtimeErrorThrower('Cannot convert spread to native array'),
    equals: runtimeErrorThrower('Cannot compare with spread'),
    asNumber: runtimeErrorThrower('Cannot convert spread to number'),
    asString: runtimeErrorThrower('Cannot convert spread to string'),
    asBoolean: runtimeErrorThrower('Cannot convert spread to boolean'),
    getProperty: runtimeErrorThrower('Cannot get property of spread'),
    setProperty: runtimeErrorThrower('Cannot set property of spread'),
    getProperties: runtimeErrorThrower('Cannot get properties of array spread'),
    getElement: runtimeErrorThrower('Cannot get element of spread'),
    getElements: () => a.getElements(),
    callFunction: runtimeErrorThrower('Cannot call an array spread'),
  };
};

export const createObjectSpread = o => {
  return {
    type: valueTypes.OBJECT_SPREAD,
    asNativeValue: runtimeErrorThrower('Cannot convert spread to native value'),
    asNativeNumber: runtimeErrorThrower('Cannot convert spread to native number'),
    asNativeString: runtimeErrorThrower('Cannot convert spread to native string'),
    asNativeBoolean: runtimeErrorThrower('Cannot convert spread to native boolean'),
    asNativeArray: runtimeErrorThrower('Cannot convert spread to native array'),
    equals: runtimeErrorThrower('Cannot compare with spread'),
    asNumber: runtimeErrorThrower('Cannot convert spread to number'),
    asString: runtimeErrorThrower('Cannot convert spread to string'),
    asBoolean: runtimeErrorThrower('Cannot convert spread to boolean'),
    getProperty: runtimeErrorThrower('Cannot get property of spread'),
    setProperty: runtimeErrorThrower('Cannot set property of spread'),
    getProperties: () => o.getProperties(),
    getElement: runtimeErrorThrower('Cannot get element of spread'),
    getElements: runtimeErrorThrower('Cannot get elements of object spread'),
    callFunction: runtimeErrorThrower('Cannot call an object spread'),
  };
};
