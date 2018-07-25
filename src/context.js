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

import { throwRuntimeError } from './error';

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

export const initializeContext = (scope, initializeScope, options, factory) => ({
  stack: [],
  scope,
  initializeScope,
  options,
  factory,
});

export const requiredParameter = (context, name) => {
  if (context.scope[name]) {
    return context.scope[name];
  }
  throwRuntimeError(`Missing required parameter ${name}`, context);
};

export const optionalParameter = (context, name) => context.scope[name];

export const optionalParameterOr = (context, name, value) => context.scope[name] ? context.scope[name] : value;
