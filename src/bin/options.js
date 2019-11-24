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

import * as R from 'ramda';
import { version } from '../../package.json';

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
    const option = config.optionsByToken[token];
    if (R.isNil(option)) {
      throw new Error(`Unrecognized option ${token}`);
    }
    return processTsOption(config, allOptions, option, R.tail(remainingArgs));
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
  toUsage: () => `${shortForm}, ${longForm}`,
});

const option = (shortForm, longForm, parameterName, message) => ({
  isFlag: false,
  keyName: keyNameFromLongForm(longForm),
  shortForm,
  longForm,
  parameterName,
  message,
  toUsage: () => `${shortForm}, ${longForm} <${parameterName}>`,
});

const validOptions = [
  flag('-p', '--print-last-value', 'Print the last evaluated value'),
  flag('-T', '--no-validate-tables', 'Disable table entry validation'),
  flag('-c', '--evaluate-callable-result', 'Evaluate results that are callable'),
  option('-l', '--max-loop-count', 'count', 'Maximum loop count'),
  option('-s', '--max-stack-depth', 'count', 'Maximum stack depth'),
  flag('-d', '--debug', 'Enable debug mode (for development)'),
];

const outputVersion = () => {
  console.log(`Tablescript v${version}`);
};

const padding = count => ' '.repeat(count);

const processConfig = (options) => ({
  optionsByToken: R.fromPairs([
    ...R.map(
      option => ([option.shortForm, option]),
      options,
    ),
    ...R.map(
      option => ([option.longForm, option]),
      options,
    ),
  ]),
  usage: () => {
    outputVersion();
    console.log('');
    console.log('Usage: tablescript [options] <file> [...args]');
    console.log('');
    console.log('Options:');
    const optionUsages = R.map(
      option => ([
        option.toUsage(),
        option.message,
      ]),
      options,
    );
    const widestUsage = R.reduce(
      (length, [usage, message]) => Math.max(length, usage.length),
      0,
      optionUsages,
    );
    optionUsages.forEach(([usage, message]) => {
      console.log(`  ${usage}${padding(widestUsage - usage.length)}  ${message}`);
    });
  }
});

const createOptionParser = (options) => ({
  parse: args => {
    const config = processConfig([
      flag('-V', '--version', 'Display the version number'),
      ...options,
      flag('-h', '--help', 'Display usage information'),
    ]);
    try {
      const processedOptions = processTsOptions(config, initialOptions, args.slice(2));
      if (processedOptions.tsOptions.help) {
        config.usage();
        process.exit(0);
      }
      if (processedOptions.tsOptions.version) {
        outputVersion();
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

export default createOptionParser(validOptions);
