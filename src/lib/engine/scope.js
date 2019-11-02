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

export const newScope = (initialScope = {}, parentScope) => {
  const localScope = initialScope;

  const getVariable = name => {
    if (R.has(name, localScope)) {
      return localScope[name];
    }
    if (R.isNil(parentScope)) {
      return undefined;
    }
    return parentScope.getVariable(name);
  };

  const getLocalVariable = name => localScope[name];
  
  const setVariable = (name, value) => {
    if (R.has(name, localScope)) {
      localScope[name] = value;
      return true;
    }
    if (R.isNil(parentScope)) {
      return false;
    }
    return parentScope.setVariable(name, value);
  };

  const setLocalVariable = (name, value) => {
    localScope[name] = value;
  };

  const setOrDeclareVariable = (name, value) => {
    if (!setVariable(name, value)) {
      setLocalVariable(name, value);
    }
  };

  return {
    parentScope,
    localScope,
    getVariable,
    getLocalVariable,
    setVariable,
    setLocalVariable,
    setOrDeclareVariable,
  };
};
