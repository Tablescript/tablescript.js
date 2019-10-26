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
import { throwRuntimeError } from "./error";

const valueAsString = value => value.asNativeString();

const dumpScopeEntry = scope => name => {
  console.log(`    ${name} = ${valueAsString(scope[name])}`);
};

const dumpScope = scope => {
  console.log('    ***** SCOPE *****');
  Object.keys(scope).forEach(dumpScopeEntry(scope));
  console.log('    *****************');
};

export const dumpContext = (context, message) => {
  console.log(`  ----- CONTEXT ${message}`);
  context.scopes().forEach(dumpScope);
  console.log('  -----');
};

export const initializeContext = (initialScope, options, factory) => {
  const stacks = {
    locations: [],
    scopes: [initialScope],
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

    scopes: () => stacks.scopes,
    pushScope: (scope = {}) => {
      stacks.scopes = [scope, ...stacks.scopes];
    },
    swapScopes: scopes => {
      const currentScopes = stacks.scopes;
      stacks.scopes = scopes;
      return currentScopes;
    },
    popScope: () => {
      stacks.scopes = [...stacks.scopes.slice(1)];
    },
    getScope: () => stacks.scopes.reverse().reduce((acc, s) => ({ ...acc, ...s }), {}),
    getVariable: name => stacks.scopes.reduce((acc, s) => acc || s[name], undefined),
    getLocalVariable: name => stacks.scopes[0][name],
    setVariable: (name, value) => {
      const frame = stacks.scopes.findIndex(s => s[name]);
      if (frame === -1) {
        stacks.scopes[0][name] = value;
      } else {
        stacks.scopes[frame][name] = value;
      }
    },
  });
};
