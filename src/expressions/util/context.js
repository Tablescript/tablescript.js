export const withSetLocation = (location, f) => context => {
  context.setLocation(location);
  return f(context);
};

export const withRestoredLocation = (location, f) => context => {
  context.pushLocation(location);
  const result = f(context);
  context.popLocation();
  return result;
};
