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
import { throwRuntimeError } from "../error";
import { newScope } from './scope';

const valueAsString = value => value.asNativeString();

const dumpScopeEntry = scope => name => {
  console.log(`    ${name} = ${valueAsString(scope[name])}`);
};

const dumpScope = scope => {
  console.log('    ***** SCOPE *****');
  Object.keys(scope.localScope).forEach(dumpScopeEntry(scope.localScope));
  console.log('    *****************');
  if (!R.isNil(scope.parentScope)) {
    dumpScope(scope.parentScope);
  }
};

export const dumpContext = (context, message) => {
  console.log(`  ----- CONTEXT ${message}`);
  dumpScope(context.getScope());
  console.log('  -----');
};

export const initializeContext = (initialScope, options, factory) => {
  const stacks = {
    locations: [],
    scope: newScope(initialScope),
  };

  return ({
    options,
    factory,
    locations: () => stacks.locations,
    pushLocation: location => {
      stacks.locations = [location, ...stacks.locations];
      if (stacks.locations.length > options.values.maximumStackDepth) {
        throwRuntimeError(`Maximum call stack depth (${options.values.maximumStackDepth}) hit`);
      }
    },
    setLocation: location => {
      stacks.locations = [location, ...stacks.locations.slice(1)];
    },
    popLocation: () => {
      stacks.locations = [...stacks.locations.slice(1)];
    },

    currentPath: () => stacks.locations[0].path,
    rootPath: () => stacks.locations[stacks.locations.length - 1].path,

    pushScope: (namespace = {}) => {
      stacks.scope = newScope(namespace, stacks.scope);
    },
    swapScope: scope => {
      const currentScope = stacks.scope;
      stacks.scope = scope;
      return currentScope;
    },
    swapWithNewScope: namespace => {
      const currentScope = stacks.scope;
      stacks.scope = newScope(namespace);
      return currentScope;
    },
    popScope: () => {
      stacks.scope = stacks.scope.parentScope;
    },

    getScope: () => stacks.scope,
    getVariable: name => stacks.scope.getVariable(name),
    getLocalVariable: name => stacks.scope.getLocalVariable(name),
    setVariable: (name, value) => {
      stacks.scope.setOrDeclareVariable(name, value);
    },
    setLocalVariable: (name, value) => {
      stacks.scope.setLocalVariable(name, value);
    },
  });
};
