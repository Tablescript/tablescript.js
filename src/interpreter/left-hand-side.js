import { valueTypes } from './types';

export const createLeftHandSideValue = name => {
  return {
    type: valueTypes.LEFT_HAND_SIDE,
    assignFrom: (context, scope, value) => {
      scope[name] = value;
    },
  };
};

export const createArrayElementLeftHandSideValue = (objectValue, indexValue) => {
  return {
    type: valueTypes.LEFT_HAND_SIDE,
    assignFrom: (context, scope, value) => {
      objectValue.setProperty(context, indexValue, value);
    },
  };
};

export const createObjectPropertyLeftHandSideValue = (objectValue, nameValue) => {
  return {
    type: valueTypes.LEFT_HAND_SIDE,
    assignFrom: (context, scope, value) => {
      objectValue.setProperty(context, nameValue, value);
    },
  };
};
