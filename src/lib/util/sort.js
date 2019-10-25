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

const swap = (items, i, j) => {
  const temp = items[i];
  items[i] = items[j];
  items[j] = temp;
};

const partition = (context, items, comparator, left, right) => {
  const pivot = items[Math.floor((right + left) / 2)];
  let i = left;
  let j = right;

  while (i <= j) {
    while (1) {
      const compareValue = comparator.callFunction(context, [items[i], pivot]);
      if (compareValue.asNativeNumber() < 0) {
        i++;
        continue;
      }
      break;
    }

    while (1) {
      const compareValue = comparator.callFunction(context, [items[j], pivot]);
      if (compareValue.asNativeNumber() > 0) {
        j--;
        continue;
      }
      break;
    }

    if (i <= j) {
      swap(items, i, j);
      i++;
      j--;
    }
  }

  return i;
};

export const quickSort = (context, items, comparator, left = 0, right = -1) => {
  if (items.length > 1) {
    if (right === -1) {
      right = items.length - 1;
    }

    const index = partition(context, items, comparator, left, right);

    if (left < index - 1) {
      quickSort(context, items, comparator, left, index - 1);
    }

    if (index < right) {
      quickSort(context, items, comparator, index, right);
    }
  }

  return items;
};
