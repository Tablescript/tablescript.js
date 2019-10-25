import { createStringValue } from '../values/string';
import { createNumericValue } from '../values/numeric';
import { createBooleanValue } from '../values/boolean';
import { createUndefined } from '../values/undefined';
import { createArrayValue } from '../values/array';
import { createObjectValue } from '../values/object';

export default {
  factory: {
    createBooleanValue,
    createNumericValue,
    createStringValue,
    createArrayValue,
    createObjectValue,
    createUndefined,
  },
};
