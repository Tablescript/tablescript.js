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

import { randomNumber } from '../util/random';
import { withRequiredArrayParameter } from '../values/util/methods';
import { createNativeFunctionValue } from '../values/function';

export const chooseBuiltIn = createNativeFunctionValue(
  ['items'],
  withRequiredArrayParameter('items', 'choose(items)')
  (
    (context, items) => items.asArray()[randomNumber(items.asArray().length) - 1],
  ),
);
