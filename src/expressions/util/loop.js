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

export const evaluateLoop = (context, condition, loopCheck, loopBlock) => {
  let expressionValue = condition.evaluate(context);
  let result = context.factory.createUndefined();
  while (loopCheck(expressionValue)) {
    result = loopBlock.evaluate(context);
    expressionValue = condition.evaluate(context);
  }
  return result;
};
