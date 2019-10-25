// Copyright 2019 Jamie Hale
//
// This file is part of Tablescript.js.
//
// Tablescript.js is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Tablescript.js is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Tablescript.js. If not, see <http://www.gnu.org/licenses/>.

import fs from 'fs';
import * as R from 'ramda';
import { initializeContext } from './context';
import { initializeBuiltins as initializeDefaultBuiltins } from './values/builtins/builtins';
import { findAndLoadScript } from './loader';
import { createArrayValue } from './values/array';
import { createBooleanValue } from './values/boolean';
import { createNumericValue } from './values/numeric';
import { createStringValue } from './values/string';
import { createUndefined } from './values/undefined';

import { parse } from './parser/tablescript-parser';
import { throwRuntimeError } from './error';
import repl from './repl';
import defaultValueFactory from './value-factory';

const optionalDefaultBuiltins = useDefaultBuiltins => (useDefaultBuiltins ? initializeDefaultBuiltins() : {});

const initializeBuiltins = options => ({
  ...optionalDefaultBuiltins(options.flags.useDefaultBuiltins),
  ...options.customBuiltins,
});

const valueFactories = {
  'string': createStringValue,
  'number': createNumericValue,
  'boolean': createBooleanValue,
};

const convertValue = (v, i) => {
  if (R.has(typeof v, valueFactories)) {
    return valueFactories[typeof v](v);
  }
  if (R.isNil(v)) {
    return createUndefined(v);
  }
  if (Array.isArray(v)) {
    return createArrayValue(R.map(convertValue, v));
  }
  throwRuntimeError(`Error converting argument ${i} to Tablescript type`);
};

const expandArguments = args => createArrayValue(R.addIndex(R.map)(convertValue, args));

const initializeScope = (args, builtins) => ({
  arguments: expandArguments(args),
  ...builtins,
});

const loadScript = (context, scriptPath) => {
  const script = findAndLoadScript(context, scriptPath);
  if (R.isNil(script)) {
    throwRuntimeError(`Unable to load "${scriptPath}"`, context);
  }
  return script;
};

const parseAndEvaluate = (context, script, scriptPath) => {
  const expression = parse(script, scriptPath);
  return expression.evaluate(context);
};

const loadParseAndEvaluate = (context, scriptPath) => {
  const script = loadScript(context, scriptPath);
  return parseAndEvaluate(context, script.body, script.path);
};

const runScript = (options, builtins, defaultValueFactory) => (script, args) => {
  const context = initializeContext(initializeScope(args, builtins), options, defaultValueFactory);
  return parseAndEvaluate(context, script, 'local');
};

const runScriptFromFile = (options, builtins, defaultValueFactory) => (scriptPath, args) => {
  const context = initializeContext(initializeScope(args, builtins), options, defaultValueFactory);
  return loadParseAndEvaluate(context, scriptPath);
};

const withSwappedScopes = (context, scopes, f) => {
  const oldScopes = context.swapScopes(scopes);
  const result = f();
  context.swapScopes(oldScopes);
  return result;
};

const importScript = builtins => (context, scriptPath, args) => {
  const initialScope = initializeScope(args, builtins);
  return withSwappedScopes(context, [initialScope], () => loadParseAndEvaluate(context, scriptPath));
};

const mergeWithDefaults = options => ({
  io: {
    fs: options.fs || fs,
    output: options.output || console.log,
  },
  flags: {
    useDefaultBuiltins: R.has('defaultBuiltins', options) ? options.defaultBuiltins : true,
    validateTables: R.has('tableValidation', options) ? options.tableValidation : true,
  },
  customBuiltins: options.customBuiltins || {},
});

export const initializeTablescript = options => {
  const mergedOptions = mergeWithDefaults(options)
  const builtins = initializeBuiltins(mergedOptions);

  const engineOptions = {
    importScript: importScript(builtins),
    io: {
      fs: mergedOptions.io.fs,
      output: mergedOptions.io.output,
    },
    flags: {
      validateTables: mergedOptions.flags.validateTables,
    },
  };

  return {
    runScript: runScript(engineOptions, builtins, defaultValueFactory),
    runScriptFromFile: runScriptFromFile(engineOptions, builtins, defaultValueFactory),
    repl: () => {
      repl(initializeContext(initializeScope([], builtins), engineOptions, defaultValueFactory));
    },
  };
};

export default initializeTablescript;
