export const randomNumber = n => {
  return Math.floor(Math.random() * n) + 1;
};

export const rollDice = (count, die) => {
  let total = 0;
  for (let i = 0; i < count; i++) {
    total += randomNumber(die);
  }
  return total;
};
