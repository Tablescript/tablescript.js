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
import { findAndLoadScript } from './loader';
import { initializeBuiltins as initializeDefaultBuiltins } from './builtins/builtins';
import {
  createArrayValue,
  createBooleanValue,
  createNumericValue,
  createStringValue,
  createUndefined,
  isCallable
} from './values';

import { parse } from './parser/tablescript-parser';
import { throwRuntimeError } from './error';
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

const optionallyCall = (context, value) => {
  if (isCallable(value) && context.options.flags.evaluateCallableResult) {
    return value.callFunction(context, []);
  }
  return value;
};

const parseAndEvaluate = (context, script, scriptPath) => {
  const expression = parse(script, scriptPath);
  return optionallyCall(context, expression.evaluate(context));
};

const loadParseAndEvaluate = (context, scriptPath) => {
  const script = loadScript(context, scriptPath);
  return parseAndEvaluate(context, script.body, script.path);
};

const createContextFactory = (options, builtins, valueFactory) =>
  (args = []) => initializeContext(initializeScope(args, builtins), options, valueFactory);

const runScript = contextFactory => (script, args, path = 'local') => parseAndEvaluate(contextFactory(args), script, path);

const runScriptFromFile = contextFactory => (scriptPath, args) => loadParseAndEvaluate(contextFactory(args), scriptPath);

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

const optionOr = (option, defaultValue) => R.isNil(option) ? defaultValue : option;

const mergeWithDefaults = options => ({
  io: {
    fs: optionOr(options.fs, fs),
    output: optionOr(options.output, console.log),
  },
  flags: {
    useDefaultBuiltins: optionOr(options.defaultBuiltins, true),
    validateTables: optionOr(options.tableValidation, true),
    evaluateCallableResult: optionOr(options.evaluateCallableResult, false),
  },
  values: {
    maximumLoopCount: optionOr(options.maximumLoopCount, 100000),
    maximumStackDepth: optionOr(options.maximumStackDepth, 200),
  },
  customBuiltins: optionOr(options.customBuiltins, {}),
});

export const initializeTablescript = options => {
  const mergedOptions = mergeWithDefaults(options)
  const builtins = initializeBuiltins(mergedOptions);

  const engineOptions = {
    importScript: importScript(builtins),
    io: R.pick(['fs', 'output'], mergedOptions.io),
    flags: R.pick(['validateTables', 'evaluateCallableResult'], mergedOptions.flags),
    values: R.pick(['maximumLoopCount', 'maximumStackDepth'], mergedOptions.values),
  };

  return {
    runScript: runScript(createContextFactory(engineOptions, builtins, defaultValueFactory)),
    runScriptFromFile: runScriptFromFile(createContextFactory(engineOptions, builtins, defaultValueFactory)),
    createContext: createContextFactory(engineOptions, builtins, defaultValueFactory),
    parseAndEvaluate,
  };
};

export default initializeTablescript;
