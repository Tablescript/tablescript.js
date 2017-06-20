import { initializeBuiltins } from './builtins';
import { createUndefined } from './undefined';

export function Interpreter() {
}

Interpreter.prototype.execute = function(ast) {
  const scope = initializeBuiltins(this);
  return ast.reduce((_, statement) => statement.evaluate(scope), createUndefined());
};

Interpreter.prototype.dumpScope = function(scope) {
  Object.keys(scope).forEach(key => {
    console.log(`${key} (${valueTypeName(scope[key].type)}) = ` + scope[key].asNativeString());
  });
};
