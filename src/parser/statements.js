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

import { createUndefined } from '../interpreter/undefined';

export const createBlock = statements => {
  const evaluate = async scope => {
    return await statements.reduce(async (_, s) => {
      return await s.evaluate(scope);
    }, createUndefined());
  };

  return {
    evaluate,
    getReferencedSymbols: () => {
      return statements.reduce((result, statement) => [...result, ...statement.getReferencedSymbols()], []);
    },
  };
};

export const createExpressionStatement = expression => {
  const evaluate = async scope => {
    return await expression.evaluate(scope);
  };

  return {
    evaluate,
    getReferencedSymbols: () => expression.getReferencedSymbols(),
  };
};
