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

Block -> "{" _ Expression:* _ "}" _ {% R.nth(1) %}

Expression ->
  Block {% id %}
  | _ AssignmentExpression __ {% R.nth(1) %}

AssignmentExpression ->
  LeftHandSideExpression _ "=" _ ConditionalExpression {% ([left, , , , right]) => ({ type: 'assign', left, right }) %}
  | LeftHandSideExpression _ "+=" _ ConditionalExpression {% ([left, , , , right]) => ({ type: 'plusEquals', left, right }) %}
  | LeftHandSideExpression _ "-=" _ ConditionalExpression {% ([left, , , , right]) => ({ type: 'minusEquals', left, right }) %}
  | LeftHandSideExpression _ "*=" _ ConditionalExpression {% ([left, , , , right]) => ({ type: 'timesEquals', left, right }) %}
  | LeftHandSideExpression _ "/=" _ ConditionalExpression {% ([left, , , , right]) => ({ type: 'divideEquals', left, right }) %}
  | LeftHandSideExpression _ "%%=" _ ConditionalExpression {% ([left, , , , right]) => ({ type: 'modEquals', left, right }) %}
  | ConditionalExpression {% id %}

LeftHandSideExpression ->
  CallExpression {% id %}

CallExpression ->
  CallExpression _ Arguments {% ([target, , args]) => { console.log('yup'); return ({ type: 'call', target, args }); } %}
  | CallExpression _ "[" _ Expression _ "]" {% ([target, , , , e]) => ({ type: 'index', target, e }) %}
  | CallExpression _ "." _ IdentifierName {% ([target, , , , property]) => ({ type: 'property', target, property }) %}
  | MemberExpression {% id %}

Arguments ->
  "(" _ ")" {% R.always([]) %}
  | "(" _ ArgumentList _ ")" {% R.nth(2) %}

ArgumentList ->
  AssignmentExpression {% id %}
  | ArgumentList _ "," _ AssignmentExpression {% ([list, , , , e]) => ([...list, e]) %}

MemberExpression ->
  MemberExpression _ "[" _ Expression _ "]"
  | MemberExpression _ "." _ Identifier
  | PrimaryExpression {% id %}

PrimaryExpression ->
  Literal                           {% id %}
  | Identifier                      {% id %}
  | FunctionExpression              {% id %}
  | ChoiceExpression                {% id %}
  | TableExpression                 {% id %}
  | "(" _ AdditiveExpression _ ")"  {% R.nth(2) %}
  | IfExpression                    {% id %}
  | WhileExpression                 {% id %}
  | UntilExpression                 {% id %}
  | SpreadExpression                {% id %}

ConditionalExpression ->
  ConditionalExpression _ "?" _ Expression _ ":" _ Expression
  | LogicalOrExpression {% id %}

LogicalOrExpression ->
  LogicalOrExpression _ "or" _ LogicalAndExpression
  | LogicalAndExpression {% id %}

LogicalAndExpression ->
  LogicalAndExpression _ "and" _ EqualityExpression
  | EqualityExpression {% id %}

EqualityExpression ->
  EqualityExpression _ "==" _ RelationalExpression
  | EqualityExpression _ "!=" _ RelationalExpression
  | RelationalExpression {% id %}

RelationalExpression ->
  RelationalExpression _ "<=" _ AdditiveExpression
  | RelationalExpression _ ">=" _ AdditiveExpression
  | RelationalExpression _ "<" _ AdditiveExpression
  | RelationalExpression _ ">" _ AdditiveExpression
  | AdditiveExpression {% id %}

AdditiveExpression ->
  AdditiveExpression _ "+" _ MultiplicativeExpression {% ([left, , , , right]) => ({ type: 'add', left, right }) %}
  | AdditiveExpression _ "-" _ MultiplicativeExpression
  | MultiplicativeExpression {% id %}

MultiplicativeExpression ->
  MultiplicativeExpression _ "*" _ UnaryExpression
  | MultiplicativeExpression _ "/" _ UnaryExpression
  | UnaryExpression {% id %}

UnaryExpression ->
  "not" __ PrimaryExpression
  | "-" _ PrimaryExpression
  | PrimaryExpression {% id %}

SpreadExpression -> "..." Expression

IfExpression -> "if" _ "(" _ Expression _ ")" _ Expression ( _ "else" _ Expression ):?

WhileExpression -> "while" _ "(" _ Expression _ ")" _ Expression

UntilExpression -> "until" _ "(" _ Expression _ ")" _ Expression

FunctionExpression -> "fn" _ "(" _ ( FormalParameterList _ ):? ")" _ Block

FormalParameterList -> Identifier ( _ "," _ Identifier ):*

ChoiceExpression -> "choice" _ ( "(" _ ( FormalParameterList _ ):? ")" _ ):? "{" _ ChoiceEntries _ "}"

ChoiceEntries -> ChoiceEntry ( _ ChoiceEntry ):*

ChoiceEntry ->
  SpreadExpression {% id %}
  | TableEntryBody {% id %}

TableExpression -> "table" _ ( "(" FormalParameterList:? ")" _ ):? "{" _ TableEntry:* _ "}"

TableEntry -> TableEntrySelector ":" _ TableEntryBody _

TableEntrySelector ->
  NonZeroInteger "-" NonZeroInteger
  | NonZeroInteger

TableEntryBody ->
  Expression {% id %}
  | Block {% id %}

Literal ->
  DiceLiteral {% id %}
  | NumberLiteral {% id %}
  | StringLiteral {% id %}
  | ArrayLiteral {% id %}
  | ObjectLiteral {% id %}
  | BooleanLiteral {% id %}
  | UndefinedLiteral {% id %}

UndefinedLiteral -> "undefined" {% () => createUndefinedLiteral() %}

BooleanLiteral ->
  "true" {% () => ({ type: 'boolean', value: true }) %}
  | "false" {% () => ({ type: 'boolean', value: false }) %}

ArrayLiteral -> "[" _ ( ArrayEntries _ ):? "]"

ArrayEntries ->
  ArrayEntries _ "," _ Expression
  | Expression {% id %}

ObjectLiteral -> "{" _ ( ObjectProperties _ ):? "}"

ObjectProperties ->
  ObjectProperties _ "," _ ObjectProperty
  | ObjectProperty {% id %}

ObjectProperty ->
  StringLiteral _ ":" _ Expression
  | Identifier _ ":" _ Expression
  | SpreadExpression

DiceLiteral ->
  NonZeroInteger:? "d"i NonZeroInteger DiceLiteralSuffix:?

DiceLiteralSuffix -> [+-] [lLhH] NonZeroInteger:?

LineTerminator ->
  "\n"
  | "\r\n"
  | "\r"

Comment -> "#" [^\n(\r\n)\r]:*

NumberLiteral ->
  Float {% id %}
  | Integer {% id %}

Float ->
  "0." DecimalDigit:*
  | NonZeroInteger "." DecimalDigit:+

Integer ->
  "0" {% () => 0 %}
  | NonZeroInteger {% id %}

NonZeroInteger -> NonZeroDigit DecimalDigit:+ {% ([head, tail]) => parseInt(`${head}${tail.join('')}`, 10) %}

NonZeroDigit -> [1-9] {% id %}

DecimalDigit -> [0-9] {% id %}

Identifier ->
  IdentifierName {%
  (data, _, reject) => {
    console.log('*******', data);
    if (R.includes(data.join(''), reservedWords)) {
      console.log('rejecting');
      return reject;
    }
    return {
      type: 'identifier',
      name: data.join(''),
    };
  }
%}

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
