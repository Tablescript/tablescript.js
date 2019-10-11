@{%
/*
  const moo = require("moo");

  const lexer = moo.compile({
    trueToken: /true/,
    falseToken: /false/,
  });
  */

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

# @lexer lexer
@builtin "whitespace.ne"

# Start -> _ Expression:* {% R.nth(1) %}
Start -> _ Expression:* {% R.compose(R.flatten, R.nth(1)) %}

ExpressionList ->
  Expression
  | ExpressionList __ Expression

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
  | MemberExpression _ "[" _ Expression _ "]"
  | MemberExpression _ "." _ IdentifierName

CallExpression ->
  CallExpression _ Arguments {% ([target, , args]) => ({ type: 'call', target, args }) %}
  | CallExpression _ "[" _ Expression _ "]" {% ([target, , , , e]) => ({ type: 'index', target, e }) %}
  | CallExpression _ "." _ IdentifierName {% ([target, , , , property]) => ({ type: 'property', target, property }) %}

Arguments ->
  "(" _ ")" {% R.always([]) %}
  | "(" _ ArgumentList _ ")" {% R.nth(2) %}

ArgumentList ->
  AssignmentExpression {% id %}
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
  IdentifierName {%
  (data, _, reject) => {
    if (R.includes(data.join(''), reservedWords)) {
      return reject;
    }
    return {
      type: 'identifier',
      name: data.join(''),
    };
  }
%}

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
  | LogicalOrExpression _ "or" _ LogicalAndExpression

LogicalAndExpression ->
  EqualityExpression {% id %}
  | LogicalAndExpression _ "and" _ EqualityExpression

EqualityExpression ->
  RelationalExpression {% id %}
  | EqualityExpression _ "==" _ RelationalExpression
  | EqualityExpression _ "!=" _ RelationalExpression

RelationalExpression ->
  AdditiveExpression {% id %}
  | RelationalExpression _ "<=" _ AdditiveExpression
  | RelationalExpression _ ">=" _ AdditiveExpression
  | RelationalExpression _ "<" _ AdditiveExpression
  | RelationalExpression _ ">" _ AdditiveExpression

AdditiveExpression ->
  MultiplicativeExpression {% id %}
  | AdditiveExpression _ "+" _ MultiplicativeExpression {% ([left, , , , right]) => ({ type: 'add', left, right }) %}
  | AdditiveExpression _ "-" _ MultiplicativeExpression

MultiplicativeExpression ->
  UnaryExpression {% id %}
  | MultiplicativeExpression _ "*" _ UnaryExpression
  | MultiplicativeExpression _ "/" _ UnaryExpression
  | MultiplicativeExpression _ "%" _ UnaryExpression

UnaryExpression ->
  LeftHandSideExpression {% id %}
  | "not" __ UnaryExpression
  | "-" _ UnaryExpression

SpreadExpression -> "..." Expression

IfExpression ->
  "if" _ "(" _ Expression _ ")" _ Expression _ "else" _ Expression
  | "if" _ "(" _ Expression _ ")" _ Expression

WhileExpression -> "while" _ "(" _ Expression _ ")" _ Expression

UntilExpression -> "until" _ "(" _ Expression _ ")" _ Expression

FunctionExpression -> "fn" _ "(" _ FormalParameters _ ")" _ "{" _ FunctionBody _ "}"

FormalParameters ->
  null
  | FormalParameterList

FormalParameterList ->
  FormalParameter
  | FormalParameterList _ "," _ FormalParameter

FormalParameter ->
  BindingElement

BindingElement ->
  SingleNameBinding
  | BindingPattern

SingleNameBinding ->
  BindingIdentifier

BindingIdentifier ->
  Identifier

BindingPattern ->
  ObjectBindingPattern
  | ArrayBindingPattern

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
  FunctionExpressionList

FunctionExpressionList ->
  ExpressionList

ChoiceExpression -> "choice" _ ( "(" _ FormalParameters _ ")" _ ):? "{" _ ChoiceEntryList _ "}"

ChoiceEntryList ->
  ChoiceEntry
  | ChoiceEntryList __ ChoiceEntry

ChoiceEntry ->
  SpreadExpression {% id %}
  | TableEntryBody {% id %}

TableExpression -> "table" _ ( "(" _ FormalParameters _ ")" _ ):? "{" _ TableEntryList _ "}"

TableEntryList ->
  TableEntry
  | TableEntryList __ TableEntry

TableEntry -> TableEntrySelector ":" _ TableEntryBody

TableEntrySelector ->
  NonZeroDecimalInteger "-" NonZeroDecimalInteger
  | NonZeroDecimalInteger

TableEntryBody ->
  Expression
  | "{" _ ExpressionList _ "}"

UndefinedLiteral -> "undefined" {% () => createUndefinedLiteral() %}

BooleanLiteral ->
  "true" {% () => ({ type: 'boolean', value: true }) %}
  | "false" {% () => ({ type: 'boolean', value: false }) %}

ArrayLiteral -> "[" _ ElementList _ "]"

ElementList ->
  AssignmentExpression {% id %}
  | ElementList _ "," _ AssignmentExpression {% ([list, , , , e]) => ([...list, e]) %}

ObjectLiteral -> "{" _ PropertyDefinitionList _ "}"

PropertyDefinitionList ->
  PropertyDefinition
  | PropertyDefinitionList _ "," _ PropertyDefinition

PropertyDefinition ->
  IdentifierReference
  | PropertyName _ ":" _ AssignmentExpression
  | "..." _ AssignmentExpression

PropertyName ->
  LiteralPropertyName
  | ComputedPropertyName

LiteralPropertyName ->
  IdentifierName
  | StringLiteral
  | NumericLiteral

ComputedPropertyName ->
  "[" _ AssignmentExpression _ "]"

DiceLiteral ->
  NonZeroDecimalInteger:? "d"i NonZeroDecimalInteger DiceLiteralSuffix:?

DiceLiteralSuffix -> [+-] [lLhH] NonZeroDecimalInteger:?

LineTerminator ->
  "\n"
  | "\r\n"
  | "\r"

Comment -> "#" [^\n(\r\n)\r]:*

NumericLiteral ->
  DecimalLiteral

DecimalLiteral ->
  DecimalIntegerLiteral "." DecimalDigits
  | "." DecimalDigits
  | DecimalIntegerLiteral

DecimalIntegerLiteral ->
  "0" {% () => 0 %}
  | NonZeroDecimalInteger {% id %}

NonZeroDecimalInteger -> NonZeroDigit DecimalDigits {% ([head, tail]) => parseInt(`${head}${tail}`, 10) %}

DecimalDigits ->
  DecimalDigit
  | DecimalDigits DecimalDigit


NonZeroDigit -> [1-9] {% id %}

DecimalDigit -> [0-9] {% id %}

IdentifierName ->
  IdentifierStart {% id %}
  | IdentifierName IdentifierPart {% ([head, tail]) => `${head}${tail}` %}

IdentifierStart -> [_a-zA-Z] {% id %}

IdentifierPart -> [_a-zA-Z0-9] {% id %}

StringLiteral ->
  "'" SingleQuoteStringCharacter:* "'" {% ([_, cs]) => cs.join('') %}
  | "\"" DoubleQuoteStringCharacter:* "\"" {% ([_, cs]) => cs.join('') %}

DoubleQuoteStringCharacter ->
  "\\\"" {% id %}
  | [^"] {% id %}

SingleQuoteStringCharacter ->
  "\\'" {% id %}
  | [^'] {% id %}
