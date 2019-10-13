@{%
  const moo = require("moo");

  const lexer = moo.compile({
    //space: { match: /[ \t\n]+/, lineBreaks: true },
    whitespace: { match: /\s/, lineBreaks: true },
    spread: '...',
    doubleQuoteString: /"(?:\\["bfnrt\/\\]|[^"\\])*"/,
    singleQuoteString: /'(?:\\'|[^'\\])*'/,
    dice: /(?:[1-9][0-9]*)?[dD][1-9][0-9]*/,
    identifierName: {
      match: /[_a-zA-Z][_a-zA-Z0-9]*/,
      type: moo.keywords({
        'true': 'true',
        false: 'false',
        not: 'not',
        orToken: 'or',
        andToken: 'and',
        fn: 'fn',
        choice: 'choice',
        table: 'table',
        ifToken: 'if',
        elseToken: 'else',
        whileToken: 'while',
        untilToken: 'until',
        undefinedToken: 'undefined',
      }),
    },
    decimal: /[0|[1-9][0-9]*]?\.[0-9]+/,
    decimalInteger: /0|[1-9][0-9]*/,
    comment: { match: /#[^\r\n]*/, lineBreaks: true },
    '==': '==',
    '!=': '!=',
    '>=': '>=',
    '<=': '<=',
    '+=': '+=',
    '-=': '-=',
    '*=': '*=',
    '/=': '/=',
    '%=': '%=',
    '<': '<',
    '>': '>',
    '=': '=',
    '(': '(',
    ')': ')',
    '{': '{',
    '}': '}',
    ',': ',',
    '.': '.',
    ':': ':',
    ';': ';',
    '[': '[',
    ']': ']',
    '+': '+',
    '-': '-',
    '*': '*',
    '/': '/',
    '%': '%',
    '?': '?',
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

Start ->
  _ SingleExpression _ {% ([ , e]) => ([e]) %}
  | _ CompoundExpression _ {% ([ , list]) => list %}

ExpressionBlock ->
  SingleExpression {% id %}
  | "{" _ CompoundExpression _ "}" {% R.nth(2) %}

CompoundExpression ->
  SingleExpression
  | CompoundExpression _ SingleExpression {% ([list, , e]) => ([...list, e]) %}

SingleExpression ->
  AssignmentExpression _ ";" {% R.nth(0) %}

AssignmentExpression ->
  ConditionalExpression {% id %}
  | LeftHandSideExpression _ "=" _ ConditionalExpression {% ([left, , , , right]) => ({ type: 'assign', op: '=', left, right }) %}
  | LeftHandSideExpression _ AssignmentOperator _ ConditionalExpression {% ([left, , op, , right]) => ({ type: 'assign', op, left, right }) %}

AssignmentOperator ->
  "+=" {% R.compose(R.prop('value'), R.nth(0)) %}
  | "-=" {% R.compose(R.prop('value'), R.nth(0)) %}
  | "*=" {% R.compose(R.prop('value'), R.nth(0)) %}
  | "/=" {% R.compose(R.prop('value'), R.nth(0)) %}
  | "%=" {% R.compose(R.prop('value'), R.nth(0)) %}

ConditionalExpression ->
  LogicalOrExpression {% id %}
  | LogicalOrExpression _ "?" _ AssignmentExpression _ ":" _ AssignmentExpression

LogicalOrExpression ->
  LogicalAndExpression {% id %}
  | LogicalOrExpression _ %orToken _ LogicalAndExpression {% ([left, , , , right]) => ({ type: 'logicalOr', left, right }) %}

LogicalAndExpression ->
  EqualityExpression {% id %}
  | LogicalAndExpression _ %andToken _ EqualityExpression {% ([left, , , , right]) => ({ type: 'logicalAnd', left, right }) %}

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
  | %not __ UnaryExpression {% ([ , , e]) => ({ type: 'logicalNot', e }) %}
  | "-" _ UnaryExpression {% ([ , , e]) => ({ type: 'negate', e }) %}

LeftHandSideExpression ->
  CallExpression {% id %}
  | MemberExpression {% id %}

CallExpression ->
  MemberExpression _ Arguments {% ([target, , args]) => ({ type: 'call', target, args }) %}
  | CallExpression _ Arguments {% ([target, , args]) => ({ type: 'call', target, args }) %}
  | CallExpression _ "[" _ AssignmentExpression _ "]" {% ([target, , , , e]) => ({ type: 'index', target, e }) %}
  | CallExpression _ "." _ IdentifierName {% ([target, , , , property]) => ({ type: 'property', target, property }) %}

Arguments ->
  "(" _ ")" {% R.always([]) %}
  | "(" _ ArgumentList _ ")" {% R.nth(2) %}

ArgumentList ->
  AssignmentExpression
  | %spread _ AssignmentExpression {% ([ , , e]) => ([{ type: 'spread', e }]) %}
  | ArgumentList _ "," _ AssignmentExpression {% ([list, , , , e]) => ([...list, e]) %}
  | ArgumentList _ "," _ %spread _ AssignmentExpression {% ([list, , , , , , e]) => ([...list, { type: 'spread', e }]) %}

MemberExpression ->
  PrimaryExpression {% id %}
  | MemberExpression _ "[" _ AssignmentExpression _ "]" {% ([target, , , , index]) => ({ type: 'member', target, index }) %}
  | MemberExpression _ "." _ IdentifierName {% ([target, , , , property]) => ({ type: 'property', target, property }) %}

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
  | "(" _ AssignmentExpression _ ")"          {% R.nth(2) %}

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

IfExpression ->
  %ifToken _ "(" _ AssignmentExpression _ ")" _ ExpressionBlock _ %elseToken _ ExpressionBlock {% ([ , , , , test, , , , ifExpression, , , , elseExpression]) => ({ type: 'if', test, ifExpression, elseExpression }) %}
  | %ifToken _ "(" _ AssignmentExpression _ ")" _ ExpressionBlock {% ([ , , , , test, , , , ifExpression]) => ({ type: 'if', test, ifExpression }) %}

WhileExpression -> %whileToken _ "(" _ AssignmentExpression _ ")" _ ExpressionBlock {% ([ , , , , test, , , , loopBlock ]) => ({ type: 'while', test, loopBlock }) %}

UntilExpression -> %untilToken _ "(" _ AssignmentExpression _ ")" _ ExpressionBlock {% ([ , , , , test, , , , loopBlock ]) => ({ type: 'until', test, loopBlock }) %}

FunctionExpression ->
  %fn _ "(" _ FormalParameters _ ")" _ "{" _ FunctionBody _ "}" {% ([ , , , , formalParams, , , , , , body]) => ({ type: 'function', formalParams, body }) %}

FunctionBody ->
  null {% () => { console.log('or here'); return []; } %}
  | CompoundExpression {% (data) => { console.log('here!', data); return data; } %}

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

ChoiceExpression ->
  %choice _ "(" _ FormalParameters _ ")" _ "{" _ ChoiceEntryList _ "}" {% ([ , , , , formalParams, , , , , , entries]) => ({ type: 'choice', formalParams, entries }) %}
  | %choice _ "{" _ ChoiceEntryList _ "}" {% ([ , , , , entries]) => ({ type: 'choice', entries }) %}

ChoiceEntryList ->
  ChoiceEntry
  | ChoiceEntryList __ ChoiceEntry {% ([list, , e]) => ([...list, e]) %}

ChoiceEntry ->
  %spread _ AssignmentExpression {% R.nth(2) %}
  | AssignmentExpression {% id %}
  | "{" _ CompoundExpression _ "}" {% R.nth(2) %}

TableExpression ->
  %table _ "(" _ FormalParameters _ ")" _ "{" _ TableEntries _ "}" {% ([ , , , , formalParams, , , , , , entries]) => ({ type: 'table', formalParams, entries }) %}
  | %table _ "{" _ TableEntries _ "}" {% ([ , , , , entries]) => ({ type: 'table', entries }) %}

TableEntries ->
  null {% R.always([]) %}
  | TableEntryList {% id %}

TableEntryList ->
  TableEntry
  | TableEntryList __ TableEntry {% ([list, , e]) => ([...list, e]) %}

TableEntry ->
  TableEntrySelector _ ":" _ AssignmentExpression {% ([selector, , , body]) => ({ type: 'tableEntry', selector, body }) %}
  | TableEntrySelector _ ":" _ "{" _ CompoundExpression _ "}" {% ([selector, , , , , , body]) => ({ type: 'tableEntry', selector, body }) %}

TableEntrySelector ->
  NonZeroDecimalInteger "-" NonZeroDecimalInteger {% ([from, , to]) => ({ type: 'tableEntrySelector', from, to }) %}
  | NonZeroDecimalInteger {% ([n]) => ({ type: 'tableEntrySelector', n }) %}

DecimalInteger ->
  %decimalInteger {% ([n]) => parseInt(n, 10) %}

NonZeroDecimalInteger ->
  %decimalInteger {% ([n], _, reject) => { const value = parseInt(n, 10); if (n === 0) { return reject; } return value; } %}

UndefinedLiteral -> %undefinedToken {% () => ({ type: 'undefinedLiteral' }) %}

BooleanLiteral ->
  %true {% () => ({ type: 'boolean', value: true }) %}
  | %false {% () => ({ type: 'boolean', value: false }) %}

ArrayLiteral ->
  "[" _ "]" {% R.always({ type: 'arrayLiteral', elements: [] }) %}
  | "[" _ ElementList _ "]" {% ([ , , elements]) => ({ type: 'arrayLiteral', elements }) %}

ElementList ->
  AssignmentExpression
  | ElementList _ "," _ AssignmentExpression {% ([list, , , , e]) => ([...list, e]) %}

ObjectLiteral ->
  "{" _ "}" {% R.always({ type: 'objectLiteral', properties: [] }) %}
  | "{" _ PropertyDefinitionList _ "}" {% ([ , , properties]) => ({ type: 'objectLiteral', properties }) %}

PropertyDefinitionList ->
  PropertyDefinition
  | PropertyDefinitionList _ "," _ PropertyDefinition {% ([list, , , , e]) => ([...list, e]) %}

PropertyDefinition ->
  IdentifierReference {% id %}
  | PropertyName _ ":" _ AssignmentExpression {% ([name, , , , e]) => ({ type: 'property', name, e }) %}
  | %spread _ AssignmentExpression {% ([ , , e]) => ({ type: 'spreadProperty', e }) %}

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
