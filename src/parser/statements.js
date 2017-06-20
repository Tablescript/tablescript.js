import { createUndefined } from '../interpreter/undefined';

export const createBlock = statements => {
  return {
    evaluate: scope => statements.reduce((_, s) => s.evaluate(scope), createUndefined()),
    getReferencedSymbols: () => {
      return statements.reduce((result, statement) => [...result, ...statement.getReferencedSymbols()], []);
    },
    json: () => statements.map(s => s.json()),
  };
};

export const createExpressionStatement = expression => {
  return {
    evaluate: scope => expression.evaluate(scope),
    getReferencedSymbols: () => expression.getReferencedSymbols(),
    json: () => ({ type: 'expression', expression: expression.json() }),
  };
};
