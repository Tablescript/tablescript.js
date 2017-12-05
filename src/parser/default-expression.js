import { expressionTypeName } from './expression-types';
import { runtimeErrorThrower } from '../error';

export const defaultExpression = (type, evaluate, getReferencedSymbols) => {
  const typeName = expressionTypeName(type);

  return {
    type,
    evaluate,
    evaluateAsLeftHandSide: runtimeErrorThrower(`Cannot assign to ${typeName}`),
    getReferencedSymbols,
  };
};
