export const updateStack = (context, location) => ({
  ...context,
  stack: [
    location,
    ...context.stack.slice(1),
  ]
});

export const pushStack = context => ({
  ...context,
  stack: [
    context.stack[0],
    ...context.stack,
  ],
});

export const copyScope = context => ({
  ...context,
  scope: {
    ...context.scope,
  },
});

export const replaceScope = (context, scope) => ({
  ...context,
  scope,
});

export const closureFromScope = context => ({ ...context.scope });
