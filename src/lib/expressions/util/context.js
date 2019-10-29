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

export const withNewScope = R.curry((scope, f, context) => {
  context.pushScope(scope);
  const result = f(context);
  context.popScope();
  return result;
});

export const withSetLocation = R.curry((location, f, context) => {
  context.setLocation(location);
  return f(context);
});

export const withRestoredLocation = R.curry((location, f, context) => {
  context.pushLocation(location);
  const result = f(context);
  context.popLocation();
  return result;
});
