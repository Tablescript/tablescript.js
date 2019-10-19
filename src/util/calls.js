export const callWithSwappedScopes = (context, scopes, f) => {
  const oldScopes = context.swapScopes(scopes);
  const result = f(context);
  context.swapScopes(oldScopes);
  return result;
};
