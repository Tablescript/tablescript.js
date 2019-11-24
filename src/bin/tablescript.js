#!/usr/bin/env node

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

import '@babel/polyfill';
import * as R from 'ramda';
import options from 'commander';
import { version } from '../../package.json';
import { initializeTablescript, TablescriptError } from '../lib';
import repl from './repl';

const processTsOptionWithValue = (config, allOptions, option, remainingArgs) => {
  if (R.isEmpty(remainingArgs)) {
    throw new Error(`No value for ${option.longForm}`);
  }

  return processTsOptions(
    config,
    {
      ...allOptions,
      tsOptions: {
        ...allOptions.tsOptions,
        [option.keyName]: R.head(remainingArgs),
      },
    },
    R.tail(remainingArgs),
  );
};

const processTsOption = (config, allOptions, option, remainingArgs) => {
  if (option.isFlag) {
    return processTsOptions(
      config,
      {
        ...allOptions,
        tsOptions: {
          ...allOptions.tsOptions,
          [option.keyName]: option.isEnablingFlag,
        },
      },
      remainingArgs,
    );
  }
  return processTsOptionWithValue(config, allOptions, option, remainingArgs);
};

const isOption = token => (token.startsWith('--') && token.length > 2) || (token.startsWith('-') && token.length > 1);

const processTsOptions = (config, allOptions, remainingArgs) => {
  if (R.isEmpty(remainingArgs)) {
    return allOptions;
  }

  const token = R.head(remainingArgs);
  if (isOption(token)) {
    if (config.isOption(token)) {
      return processTsOption(config, allOptions, config.optionsByToken[token], R.tail(remainingArgs));
    }
    throw new Error(`Unrecognized option ${token}`);
  }

  return {
    ...allOptions,
    filename: token,
    scriptArgs: R.tail(remainingArgs),
  };
};

const initialOptions = {
  tsOptions: {},
  scriptArgs: [],
};

const longFormTokens = longForm => {
  const tokens = longForm.slice(2).split('-');
  if (tokens[0] === 'no') {
    return tokens.slice(1);
  }
  return tokens;
};

const keyNameFromLongForm = longForm => {
  const tokens = longFormTokens(longForm);
  return R.join(
    '',
    [
      R.head(tokens),
      ...R.map(
        s => `${R.head(s).toUpperCase()}${R.tail(s)}`,
        R.tail(tokens),
      ),
    ],
  );
};

const flag = (shortForm, longForm, message) => ({
  isFlag: true,
  keyName: keyNameFromLongForm(longForm),
  shortForm,
  longForm,
  message,
  isEnablingFlag: longForm.slice(2).split('-')[0] !== 'no',
});

const option = (shortForm, longForm, parameterName, message) => ({
  isFlag: false,
  keyName: keyNameFromLongForm(longForm),
  shortForm,
  longForm,
  parameterName,
  message,
});

const validOptions = [
  option('-l', '--max-loop-count', 'count', 'Maximum loop count'),
  option('-s', '--max-stack-depth', 'count', 'Maximum stack depth'),
];

const validFlags = [
  flag('-p', '--print-last-value', 'Print the last evaluated value'),
  flag('-V', '--no-validate-tables', 'Print the last evaluated value'),
  flag('-c', '--evaluate-callable-result', 'Evaluate results that are callable'),
  flag('-d', '--debug', 'Enable debug mode (for development)'),
];

const optionIncludes = (token, options) => R.any(R.propEq('shortForm', token), options) || R.any(R.propEq('longForm', token), options);

const processConfig = (options, flags) => ({
  optionsByToken: R.fromPairs([
    ...R.map(
      option => ([option.shortForm, option]),
      [
        ...flags,
        ...options,
      ],
    ),
    ...R.map(
      option => ([option.longForm, option]),
      [
        ...flags,
        ...options,
      ],
    ),
  ]),
  isOption: token => optionIncludes(token, [
    ...flags,
    ...options,
  ]),
  isFlag: token => optionIncludes(token, flags),
  usage: () => {
    console.log(`Tablescript v${version}`);
    console.log('');
    console.log('Usage: tablescript [options] <file> [...args]');
    console.log('');
    console.log('Options:');
    flags.forEach(flag => {
      console.log(`  ${flag.shortForm}, ${flag.longForm}: ${flag.message}`);
    });
    options.forEach(option => {
      console.log(`  ${option.shortForm}, ${option.longForm} <${option.parameterName}>: ${option.message}`);
    })
  }
});

const createOptionParser = (flags, options) => ({
  parse: args => {
    const config = processConfig(
      options,
      [
        ...flags,
        flag('-h', '--help', 'Display usage information'),
      ],
    );
    try {
      const processedOptions = processTsOptions(config, initialOptions, args.slice(2));
      if (processedOptions.tsOptions.help) {
        config.usage();
        process.exit(0);
      }
      return processedOptions;
    }
    catch (e) {
      console.log(e.message);
      config.usage();
      process.exit(-1);
    }
  },
});

const optionParser = createOptionParser(validFlags, validOptions);
const newOptions = optionParser.parse(process.argv);
console.log(JSON.stringify(newOptions, null, 2));
process.exit(0);

options
  .version(`Tablescript v${version}`)
  .usage('[options] <file> [...args]')
  .option('-p, --print-last-value', 'Print the last evaluated value')
  .option('-V, --no-validate-tables', 'Disable table entry validation')
  .option('-c, --evaluate-callable-result', 'Evaluate callable results')
  .option('-l, --max-loop-count <count>', 'Maximum loop count')
  .option('-s, --max-stack-depth <count>', 'Maximum stack depth')
  .option('-d, --debug', 'Enable debug mode (for development)')
  .parse(process.argv);

const filename = options.args[0];
const args = options.args.slice(1);

console.log('args', options.args);

const optionOr = (option, defaultValue) => R.isNil(option) ? defaultValue : option;

const tablescript = initializeTablescript({
  validateTables: optionOr(options.validateTables, true),
  evaluateCallableResult: optionOr(options.evaluateCallableResult, false),
  maximumLoopCount: optionOr(options.maxLoopCount, undefined),
  maximumStackDepth: optionOr(options.maxStackDepth, undefined),
  debug: optionOr(options.debug, false),
});


if (!filename) {
  repl(tablescript);
} else {
  try {
    const value = tablescript.runScriptFromFile(filename, args);
    if (options.printLastValue) {
      console.log(value.asNativeValue());
    }
  } catch (e) {
    if (e instanceof TablescriptError) {
      console.log(e.toString());
    } else {
      if (options.debug) {
        console.log(e);
      } else {
        console.log(`Internal Error: ${ e.toString() }`);
      }
    }
    process.exit(-1);
  }
}
