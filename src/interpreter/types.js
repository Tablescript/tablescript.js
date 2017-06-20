export const valueTypes = {
  NUMBER: Symbol('NUMBER'),
  STRING: Symbol('STRING'),
  FUNCTION: Symbol('FUNCTION'),
  TABLE: Symbol('TABLE'),
  OBJECT: Symbol('OBJECT'),
  ARRAY: Symbol('ARRAY'),
  BOOLEAN: Symbol('BOOLEAN'),
  LEFT_HAND_SIDE: Symbol('LEFT_HAND_SIDE'),
  ARRAY_SPREAD: Symbol('ARRAY_SPREAD'),
  OBJECT_SPREAD: Symbol('OBJECT_SPREAD'),
  UNDEFINED: Symbol('UNDEFINED'),
};

export const valueTypeName = type => {
  switch (type) {
    case valueTypes.NUMBER:
      return 'NUMBER';
    case valueTypes.STRING:
      return 'STRING';
    case valueTypes.FUNCTION:
      return 'FUNCTION';
    case valueTypes.TABLE:
      return 'TABLE';
    case valueTypes.OBJECT:
      return 'OBJECT';
    case valueTypes.ARRAY:
      return 'ARRAY';
    case valueTypes.BOOLEAN:
      return 'BOOLEAN';
    case valueTypes.LEFT_HAND_SIDE:
      return 'LEFT_HAND_SIDE';
    case valueTypes.ARRAY_SPREAD:
      return 'ARRAY_SPREAD';
    case valueTypes.OBJECT_SPREAD:
      return 'OBJECT_SPREAD';
    case valueTypes.UNDEFINED:
      return 'UNDEFINED';
    default:
      return '<TYPE UNSET>';
  }
};
