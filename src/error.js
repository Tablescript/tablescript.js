export class TablescriptError {
  constructor(name, message, context, trace) {
    this.name = name;
    this.message = message;
    this.context = context;
    this.trace = trace;
  }

  toString() {
    return `${this.contextToString()}[${this.name}] ${this.message}`;
  }

  contextToString() {
    if (this.context) {
      return `${this.context.path} (line ${this.context.line} column ${this.context.column}): `;
    }
    return '';
  }
}

export const throwRuntimeError = (message, context) => {
  throw new TablescriptError('RuntimeError', message, context);
};

export const runtimeErrorThrower = message => context => {
  throwRuntimeError(message, context);
};
