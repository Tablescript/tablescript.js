import R from 'ramda';
import { valueTypes } from '../values/types';

export const isBooleanValue = expected => value => {
  if (value.type !== valueTypes.BOOLEAN) {
    throw new Error('Expecting a BOOLEAN');
  }
  const actual = value.asNativeBoolean();
  if (actual !== expected) {
    throw new Error(`Expecting ${expected} but got ${actual}`);
  }
  return true;
};

export const isNumericValue = expected => value => {
  if (value.type !== valueTypes.NUMBER) {
    throw new Error('Expecting a NUMBER');
  }
  const actual = value.asNativeNumber();
  if (actual !== expected) {
    throw new Error(`Expecting ${expected} but got ${actual}`);
  }
  return true;
};

export const isStringValue = expected => value => {
  if (value.type !== valueTypes.STRING) {
    throw new Error('Expecting a STRING');
  }
  const actual = value.asNativeString();
  if (actual !== expected) {
    throw new Error(`Expecting ${expected} but got ${actual}`);
  }
  return true;
};

export const isArrayValue = expected => value => {
  if (value.type !== valueTypes.ARRAY) {
    throw new Error('Expecting an ARRAY');
  }
  const actual = value.asNativeArray();
  if (!R.equals(actual, expected)) {
    throw new Error(`Expecting ${expected} but got ${actual}`);
  }
  return true;
};

export const isUndefined = value => {
  if (value.type !== valueTypes.UNDEFINED) {
    throw new Error('Expecting a UNDEFINED');
  }
  return true;
};
