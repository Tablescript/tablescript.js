// Copyright 2017 Jamie Hale
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

import { initializeBuiltins } from './values/builtins/builtins';
import { initializeMath } from './values/math/math';
import { createStringValue } from './values/string';
import { createArrayValue } from './values/array';
import { createObjectValue } from './values/object';

export const updateStack = (context, location) => ({
  ...context,
  stack: [
    location,
    ...context.stack.slice(1),
  ]
});

export const pushStack = context => ({
  ...context,
  stack: [
    context.stack[0],
    ...context.stack,
  ],
});

export const copyScope = context => ({
  ...context,
  scope: {
    ...context.scope,
  },
});

export const replaceScope = (context, scope) => ({
  ...context,
  scope,
});

export const closureFromScope = context => ({ ...context.scope });

const expandArguments = args => ({
  arguments: createArrayValue(args.map(a => (typeof a === 'string') ? createStringValue(a) : a))
});

export const initializeScope = (args, options) => ({
  system: createObjectValue({
    ...expandArguments(args),
    ...initializeBuiltins(options),
  }),
  math: createObjectValue({
    ...initializeMath(options),
  }),
});

export const initializeContext = (args, options) => ({
  stack: [],
  scope: initializeScope(args, options),
  options,
});
