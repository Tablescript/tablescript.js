import { initializeContext } from './context';
import { runScript, loadAndRunScript } from './runner';
import { initializeBuiltins } from './builtins/builtins';
import { loadFsFile } from './fs-loader';
import { loadHttpFile } from './http-loader';
import { createArrayValue } from './values/array';
import { createBooleanValue } from './values/boolean';
import { createNumericValue } from './values/numeric';
import { createStringValue } from './values/string';
import { createUndefined } from './values/undefined';

const defaultInterpreterOptions = options => ({
  input: {
    loaders: [loadFsFile, loadHttpFile],
  },
  output: {
    print: s => {
      console.log(s);
    },
  },
  flags: {
    validateTables: options.tableValidation,
  }
});

const expandArguments = args => ({
  arguments: createArrayValue(args.map(a => (typeof a === 'string') ? createStringValue(a) : a))
});

const defaultInitializeScope = (args, options) => ({
  ...expandArguments(args),
  ...initializeBuiltins(options),
});

const defaultValueFactory = {
  createArrayValue,
  createBooleanValue,
  createNumericValue,
  createStringValue,
  createUndefined,
};

export {
  initializeContext,
  runScript,
  loadAndRunScript,
  defaultInterpreterOptions,
  defaultInitializeScope,
  defaultValueFactory,
};
