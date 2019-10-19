import * as R from 'ramda';

export const evaluateExpressions = expressions => context => R.reduce((_, expression) => expression.evaluate(context), context.factory.createUndefined(), expressions);
