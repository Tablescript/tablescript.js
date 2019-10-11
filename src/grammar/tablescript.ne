@{%
  const moo = require("moo");

  const lexer = moo.compile({
    //space: { match: /[ \t\n]+/, lineBreaks: true },
    whitespace: { match: /\s/, lineBreaks: true },
    true: 'true',
    false: 'false',
    fn: 'fn',
    choice: 'choice',
    table: 'table',
    doubleQuoteString: /"(?:\\["bfnrt\/\\]|[^"\\])*"/,
    singleQuoteString: /'(?:\\'|[^'\\])*'/,
    dice: /(?:[1-9][0-9]*)?[dD][1-9][0-9]*/,
    identifierName: /[_a-zA-Z][_a-zA-Z0-9]*/,
    decimal: /[0|[1-9][0-9]*]?\.[0-9]+/,
    decimalInteger: /0|[1-9][0-9]*/,
    nonZeroDecimalInteger: /[1-9][0-9]*/,
    undefined: 'undefined',
    comment: { match: /#[^\r\n]*/, lineBreaks: true },
    '==': '==',
    '!=': '!=',
    '=': '=',
    '(': '(',
    ')': ')',
    '{': '{',
    '}': '}',
    ',': ',',
    '.': '.',
    ':': ':',
    '[': '[',
    ']': ']',
    '+': '+',
  });

  const R = require('ramda');
  /*
  const { createBlockExpression } = require('../expressions/block');
  const { createCompoundExpression } = require('../expressions/compound');
  const { createAssignmentExpression } = require('../expressions/assignment');
  const { createConditionalExpression } = require('../expressions/conditional');
  const { createBinaryExpression } = require('../expressions/binary');
  const { createUnaryExpression } = require('../expressions/unary');
  const { createCallExpression } = require('../expressions/call');
  const { createObjectPropertyExpression } = require('../expressions/object-property');
  const { createFunctionExpression } = require('../expressions/function');
  const { createTableExpression } = require('../expressions/table');
  const {
    createTableEntryExpression,
    createSimpleTableEntryExpression,
    createSpreadTableEntryExpression,
  } = require('../expressions/table-entry');
  const {
    createRangeTableSelector,
    createExactTableSelector,
  } = require('../expressions/table-selector');
  const { createVariableExpression } = require('../expressions/variable');
  const { createBooleanLiteral } = require('../expressions/boolean-literal');
  const { createArrayLiteral } = require('../expressions/array-literal');
  const {
    createObjectLiteral,
    createObjectLiteralPropertyExpression
  } = require('../expressions/object-literal');
  const {
    createDiceLiteral,
    createDiceLiteralSuffix
  } = require('../expressions/dice-literal');
  const { createNumberLiteral } = require('../expressions/number-literal');
  const { createStringLiteral } = require('../expressions/string-literal');
  const { createTemplateStringLiteral } = require('../expressions/template-string-literal');
  const { createUndefinedLiteral } = require('../expressions/undefined-literal');
  const { createIfExpression } = require('../expressions/if');
  const { createWhileExpression } = require('../expressions/while');
  const { createUntilExpression } = require('../expressions/until');
  const { createSpreadExpression } = require('../expressions/spread');

  const composeBinaryExpression = (context, head, tail) => {
    return tail.reduce((result, element) => createBinaryExpression(context, result, element[1], element[3]), head);
  };

  const optionalList = (list) => list ? list : [];
  const extractOptional = (optional, index) => optional ? optional[index] : null;
  const extractList = (list, index) => list.map(e => e[index]);
  const composeList = (head, tail) => [head, ...tail];
  const buildList = (head, tail, index) => [head, ...extractList(tail, index)];

  const createLocation = (location, options) => ({
    path: options.path,
    line: location.start.line,
    column: location.start.column,
  });
  */

  const reservedWords = [
    'true',
    'false',
  ];
%}

@lexer lexer

# Start -> _ Expression:* {% R.nth(1) %}
Start ->
  _ {% R.always([]) %}
  | _ ExpressionList _ {% R.nth(1) %}

ExpressionList ->
  Expression
  | ExpressionList __ Expression {% ([list, , e]) => ([...list, e]) %}

Expression ->
  AssignmentExpression {% id %}
  | "{" _ ExpressionList _ "}" {% R.nth(2) %}

AssignmentExpression ->
  ConditionalExpression {% id %}
  | LeftHandSideExpression _ "=" _ ConditionalExpression {% ([left, , , , right]) => ({ type: 'assign', op: '=', left, right }) %}
  | LeftHandSideExpression _ AssignmentOperator _ ConditionalExpression {% ([left, , op, , right]) => ({ type: 'assign', op, left, right }) %}

AssignmentOperator ->
  "+=" {% id %}
  | "-=" {% id %}
  | "*=" {% id %}
  | "/=" {% id %}
  | "%=" {% id %}

LeftHandSideExpression ->
  MemberExpression {% id %}
  | CallExpression {% id %}

MemberExpression ->
  PrimaryExpression {% id %}
  | MemberExpression _ "[" _ Expression _ "]" {% ([target, , , , index]) => ({ type: 'member', target, index }) %}
  | MemberExpression _ "." _ IdentifierName {% ([target, , , , property]) => ({ type: 'property', target, property }) %}

CallExpression ->
  MemberExpression _ Arguments {% ([target, , args]) => ({ type: 'call', target, args }) %}
  | CallExpression _ Arguments {% ([target, , args]) => ({ type: 'call', target, args }) %}
  | CallExpression _ "[" _ Expression _ "]" {% ([target, , , , e]) => ({ type: 'index', target, e }) %}
  | CallExpression _ "." _ IdentifierName {% ([target, , , , property]) => ({ type: 'property', target, property }) %}

Arguments ->
  "(" _ ")" {% R.always([]) %}
  | "(" _ ArgumentList _ ")" {% R.nth(2) %}

ArgumentList ->
  AssignmentExpression
  | ArgumentList _ "," _ AssignmentExpression {% ([list, , , , e]) => ([...list, e]) %}

PrimaryExpression ->
  IdentifierReference               {% id %}
  | Literal                         {% id %}
  | ArrayLiteral                    {% id %}
  | ObjectLiteral                   {% id %}
  | FunctionExpression              {% id %}
  | ChoiceExpression                {% id %}
  | TableExpression                 {% id %}
  | IfExpression                    {% id %}
  | WhileExpression                 {% id %}
  | UntilExpression                 {% id %}

IdentifierReference ->
  Identifier {% id %}

Identifier ->
  IdentifierName {% ([name]) => ({ type: 'identifier', name }) %}

Literal ->
  UndefinedLiteral {% id %}
  | BooleanLiteral {% id %}
  | NumericLiteral {% id %}
  | StringLiteral {% id %}
  | DiceLiteral {% id %}

ConditionalExpression ->
  LogicalOrExpression {% id %}
  | LogicalOrExpression _ "?" _ AssignmentExpression _ ":" _ AssignmentExpression

LogicalOrExpression ->
  LogicalAndExpression {% id %}
  | LogicalOrExpression _ "or" _ LogicalAndExpression {% ([left, , , , right]) => ({ type: 'logicalOr', left, right }) %}

LogicalAndExpression ->
  EqualityExpression {% id %}
  | LogicalAndExpression _ "and" _ EqualityExpression {% ([left, , , , right]) => ({ type: 'logicalAnd', left, right }) %}

EqualityExpression ->
  RelationalExpression {% id %}
  | EqualityExpression _ "==" _ RelationalExpression {% ([left, , , , right]) => ({ type: 'equality', left, right }) %}
  | EqualityExpression _ "!=" _ RelationalExpression {% ([left, , , , right]) => ({ type: 'inequality', left, right }) %}

RelationalExpression ->
  AdditiveExpression {% id %}
  | RelationalExpression _ "<=" _ AdditiveExpression
  | RelationalExpression _ ">=" _ AdditiveExpression
  | RelationalExpression _ "<" _ AdditiveExpression
  | RelationalExpression _ ">" _ AdditiveExpression

AdditiveExpression ->
  MultiplicativeExpression {% id %}
  | AdditiveExpression _ "+" _ MultiplicativeExpression {% ([left, , , , right]) => ({ type: 'add', left, right }) %}
  | AdditiveExpression _ "-" _ MultiplicativeExpression {% ([left, , , , right]) => ({ type: 'subtract', left, right }) %}

MultiplicativeExpression ->
  UnaryExpression {% id %}
  | MultiplicativeExpression _ "*" _ UnaryExpression {% ([left, , , , right]) => ({ type: 'multiply', left, right }) %}
  | MultiplicativeExpression _ "/" _ UnaryExpression {% ([left, , , , right]) => ({ type: 'divide', left, right }) %}
  | MultiplicativeExpression _ "%" _ UnaryExpression {% ([left, , , , right]) => ({ type: 'modulo', left, right }) %}

UnaryExpression ->
  LeftHandSideExpression {% id %}
  | "not" __ UnaryExpression {% ([ , , e]) => ({ type: 'logicalNot', e }) %}
  | "-" _ UnaryExpression {% ([ , , e]) => ({ type: 'negate', e }) %}

SpreadExpression -> "..." Expression

IfExpression ->
  "if" _ "(" _ Expression _ ")" _ Expression _ "else" _ Expression
  | "if" _ "(" _ Expression _ ")" _ Expression

WhileExpression -> "while" _ "(" _ Expression _ ")" _ Expression

UntilExpression -> "until" _ "(" _ Expression _ ")" _ Expression

FunctionExpression -> %fn _ "(" _ FormalParameters _ ")" _ "{" _ FunctionBody _ "}" {% ([ , , , , formalParams, , , , , , body]) => ({ type: 'function', formalParams, body }) %}

FormalParameters ->
  null {% R.always([]) %}
  | FormalParameterList {% id %}

FormalParameterList ->
  FormalParameter
  | FormalParameterList _ "," _ FormalParameter {% ([list, , , , p]) => ([...list, p]) %}

FormalParameter ->
  BindingElement {% id %}

BindingElement ->
  SingleNameBinding {% id %}
  | BindingPattern {% id %}

SingleNameBinding ->
  BindingIdentifier {% id %}

BindingIdentifier ->
  Identifier {% id %}

BindingPattern ->
  ObjectBindingPattern {% id %}
  | ArrayBindingPattern {% id %}

ObjectBindingPattern ->
  "{" _ "}"
  | "{" _ BindingPropertyList _ "}"

BindingPropertyList ->
  BindingProperty
  | BindingPropertyList _ "," _ BindingProperty

BindingProperty ->
  SingleNameBinding
  | PropertyName _ ":" _ BindingElement

ArrayBindingPattern ->
  "[" _ BindingElementList _ "]"

BindingElementList ->
  BindingElement
  | BindingElementList _ "," _ BindingElement

FunctionBody ->
  FunctionExpressionList {% id %}

FunctionExpressionList ->
  ExpressionList {% id %}

ChoiceExpression ->
  %choice _ "(" _ FormalParameters _ ")" _ "{" _ ChoiceEntryList _ "}" {% ([ , , , , formalParams, , , , , , entries]) => ({ type: 'choice', formalParams, entries }) %}
  | %choice _ "{" _ ChoiceEntryList _ "}" {% ([ , , , , entries]) => ({ type: 'choice', entries }) %}

ChoiceEntryList ->
  ChoiceEntry
  | ChoiceEntryList __ ChoiceEntry {% ([list, , e]) => ([...list, e]) %}

ChoiceEntry ->
  SpreadExpression {% id %}
  | TableEntryBody {% id %}

TableExpression ->
  %table _ "(" _ FormalParameters _ ")" _ "{" _ TableEntryList _ "}" {% ([ , , , , formalParams, , , , , , entries]) => ({ type: 'table', formalParams, entries }) %}
  | %table _ "{" _ TableEntryList _ "}" {% ([ , , , , entries]) => ({ type: 'table', entries }) %}

TableEntryList ->
  TableEntry
  | TableEntryList __ TableEntry {% ([list, , e]) => ([...list, e]) %}

TableEntry -> TableEntrySelector _ ":" _ TableEntryBody {% ([selector, , , body]) => ({ type: 'tableEntry', selector, body }) %}

TableEntrySelector ->
  NonZeroDecimalInteger "-" NonZeroDecimalInteger {% ([from, , to]) => ({ type: 'tableEntrySelector', from, to }) %}
  | NonZeroDecimalInteger {% ([n]) => ({ type: 'tableEntrySelector', n }) %}

TableEntryBody ->
  Expression {% id %}
  | "{" _ ExpressionList _ "}" {% R.nth(2) %}

UndefinedLiteral -> "undefined" {% () => ({ type: 'undefinedLiteral' }) %}

BooleanLiteral ->
  %true {% () => ({ type: 'boolean', value: true }) %}
  | %false {% () => ({ type: 'boolean', value: false }) %}

ArrayLiteral -> "[" _ ElementList _ "]" {% ([ , , elements]) => ({ type: 'arrayLiteral', elements }) %}

ElementList ->
  AssignmentExpression
  | ElementList _ "," _ AssignmentExpression {% ([list, , , , e]) => ([...list, e]) %}

ObjectLiteral -> "{" _ PropertyDefinitionList _ "}" {% ([ , , properties]) => ({ type: 'objectLiteral', properties }) %}

PropertyDefinitionList ->
  PropertyDefinition
  | PropertyDefinitionList _ "," _ PropertyDefinition {% ([list, , , , e]) => ([...list, e]) %}

PropertyDefinition ->
  IdentifierReference {% id %}
  | PropertyName _ ":" _ AssignmentExpression {% ([name, , , , e]) => ({ type: 'property', name, e }) %}
  | "..." _ AssignmentExpression {% ([ , , e]) => ({ type: 'spreadProperty', e }) %}

PropertyName ->
  LiteralPropertyName {% id %}
  | ComputedPropertyName {% id %}

LiteralPropertyName ->
  IdentifierName {% id %}
  | StringLiteral {% id %}
  | NumericLiteral {% id %}

ComputedPropertyName ->
  "[" _ AssignmentExpression _ "]" {% ([ , , e]) => ({ type: 'computedPropertyName', e }) %}

DiceLiteral ->
  %dice {% ([dice]) => ({ type: 'diceLiteral', dice: dice.value }) %}

DiceLiteralSuffix -> [+-] [lLhH] NonZeroDecimalInteger:?

NumericLiteral ->
  %decimal {% ([n]) => ({ type: 'numericLiteral', value: parseFloat(n) }) %}
  | %decimalInteger {% ([n]) => ({ type: 'numericLiteral', value: parseInt(n, 10) }) %}

NonZeroDecimalInteger -> %nonZeroDecimalInteger {% ([n]) => parseInt(n, 10) %}

IdentifierName ->
  %identifierName {% R.compose(R.prop('value'), R.nth(0)) %}

StringLiteral ->
  %doubleQuoteString {% ([data]) => ({ type: 'stringLiteral', s: data.value }) %}
  | %singleQuoteString {% ([data]) => ({ type: 'stringLiteral', s: data.value }) %}

_ ->
  null
  | _ %whitespace {% R.always(null) %}
  | _ %comment {% R.always(null) %}

__ ->
  %whitespace {% R.always(null) %}
  | __ %whitespace {% R.always(null) %}
  | __ %comment {% R.always(null) %}
