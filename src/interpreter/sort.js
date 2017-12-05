const swap = (items, firstIndex, secondIndex) => {
  var temp = items[firstIndex];
  items[firstIndex] = items[secondIndex];
  items[secondIndex] = temp;
};

const partition = async (context, scope, items, c, left, right) => {
  const pivot = items[Math.floor((right + left) / 2)];
  let i = left;
  let j = right;

  while (i <= j) {
    while (1) {
      const compareValue = await c.callFunction(context, scope, [items[i], pivot]);
      if (compareValue.asNativeNumber(context) < 0) {
        i++;
        continue;
      }
      break;
    }

    while (1) {
      const compareValue = await c.callFunction(context, scope, [items[j], pivot]);
      if (compareValue.asNativeNumber(context) > 0) {
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

export const quickSort = async (context, scope, items, c, left = 0, right = -1) => {
  if (items.length > 1) {
    if (right === -1) {
      right = items.length - 1;
    }

    const index = await partition(context, scope, items, c, left, right);
    if (left < index - 1) {
      await quickSort(context, scope, items, c, left, index - 1);
    }

    if (index < right) {
      await quickSort(context, scope, items, c, index, right);
    }
  }

  return items;
};
