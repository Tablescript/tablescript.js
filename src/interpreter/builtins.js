import { throwRuntimeError } from '../error';
import { valueTypes } from './types';
import { createStringValue } from './string';
import { findAndParseFile } from '../parser/parser';

const printBuiltin = {
  type: valueTypes.FUNCTION,
  callFunction: (context, scope, parameters) => {
    const output = parameters.map(p => p.asNativeString(context)).join();
    console.log(output);
    return createStringValue(output);
  },
  asString: () => 'builtin(print)',
};

const createRequireBuiltin = interpreter => {
  return {
    type: valueTypes.FUNCTION,
    callFunction: (context, scope, parameters) => {
      const filename = parameters[0].asNativeString(context);
      const ast = findAndParseFile(context, filename);
      if (ast) {
        return interpreter.execute(ast);
      }
      throwRuntimeError(`require() file not found (${filename})`, context);
    },
    asString: () => 'builtin(require)',
  };
};

export const initializeBuiltins = interpreter => ({
  print: printBuiltin,
  require: createRequireBuiltin(interpreter),
});
