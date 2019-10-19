export const evaluateLoop = (context, condition, loopCheck, loopBlock) => {
  let expressionValue = condition.evaluate(context);
  let result = context.factory.createUndefined();
  while (loopCheck(expressionValue)) {
    result = loopBlock.evaluate(context);
    expressionValue = condition.evaluate(context);
  }
  return result;
};
