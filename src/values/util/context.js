export const callWithSwappedScopes = (context, scopes, f) => {
  const oldScopes = context.swapScopes(scopes);
  const result = f(context);
  context.swapScopes(oldScopes);
  return result;
};

export const withSwappedScopes = (buildScopes, f) => (context, parameters) => {
  const oldScopes = context.swapScopes(buildScopes(context, parameters));
  const result = f(context);
  context.swapScopes(oldScopes);
  return result;
};
