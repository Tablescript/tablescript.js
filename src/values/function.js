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
import { createValue } from './default';
import { valueTypes } from './types';
import { bindFunctionParameters } from './util/parameters';
import { withSwappedScopes } from './util/context';

export const createFunctionValue = (formalParameters, body, closure) => {
  const asNativeString = R.always('function(tablescript)');

  return createValue(
    valueTypes.FUNCTION,
    asNativeString,
    R.F,
    R.F,
    {},
    {
      asNativeString,
      asNativeBoolean: R.T,
      callFunction: withSwappedScopes(
        (context, parameters) => ([
          bindFunctionParameters(context, formalParameters, parameters),
          closure,
        ]),
        body.evaluate,
      ),
    }
  );
};
