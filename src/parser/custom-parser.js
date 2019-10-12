// Generated automatically by nearley, version 2.19.0
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

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
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "Start", "symbols": ["_", "CompoundExpression"], "postprocess": ([ , list]) => list},
    {"name": "ExpressionBlock", "symbols": ["SingleExpression"], "postprocess": id},
    {"name": "ExpressionBlock", "symbols": [{"literal":"{"}, "_", "CompoundExpression", "_", {"literal":"}"}], "postprocess": R.nth(2)},
    {"name": "CompoundExpression$ebnf$1", "symbols": ["SingleExpression"]},
    {"name": "CompoundExpression$ebnf$1", "symbols": ["CompoundExpression$ebnf$1", "SingleExpression"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "CompoundExpression", "symbols": ["CompoundExpression$ebnf$1"], "postprocess": id},
    {"name": "SingleExpression", "symbols": ["AssignmentExpression", "_", {"literal":";"}, "_"], "postprocess": R.nth(0)},
    {"name": "AssignmentExpression", "symbols": ["ConditionalExpression"], "postprocess": id},
    {"name": "AssignmentExpression", "symbols": ["LeftHandSideExpression", "_", {"literal":"="}, "_", "ConditionalExpression"], "postprocess": ([left, , , , right]) => ({ type: 'assign', op: '=', left, right })},
    {"name": "AssignmentExpression", "symbols": ["LeftHandSideExpression", "_", "AssignmentOperator", "_", "ConditionalExpression"], "postprocess": ([left, , op, , right]) => ({ type: 'assign', op, left, right })},
    {"name": "AssignmentOperator", "symbols": [{"literal":"+="}], "postprocess": R.compose(R.prop('value'), R.nth(0))},
    {"name": "AssignmentOperator", "symbols": [{"literal":"-="}], "postprocess": R.compose(R.prop('value'), R.nth(0))},
    {"name": "AssignmentOperator", "symbols": [{"literal":"*="}], "postprocess": R.compose(R.prop('value'), R.nth(0))},
    {"name": "AssignmentOperator", "symbols": [{"literal":"/="}], "postprocess": R.compose(R.prop('value'), R.nth(0))},
    {"name": "AssignmentOperator", "symbols": [{"literal":"%="}], "postprocess": R.compose(R.prop('value'), R.nth(0))},
    {"name": "ConditionalExpression", "symbols": ["LogicalOrExpression"], "postprocess": id},
    {"name": "ConditionalExpression", "symbols": ["LogicalOrExpression", "_", {"literal":"?"}, "_", "AssignmentExpression", "_", {"literal":":"}, "_", "AssignmentExpression"]},
    {"name": "LogicalOrExpression", "symbols": ["LogicalAndExpression"], "postprocess": id},
    {"name": "LogicalOrExpression", "symbols": ["LogicalOrExpression", "_", (lexer.has("orToken") ? {type: "orToken"} : orToken), "_", "LogicalAndExpression"], "postprocess": ([left, , , , right]) => ({ type: 'logicalOr', left, right })},
    {"name": "LogicalAndExpression", "symbols": ["EqualityExpression"], "postprocess": id},
    {"name": "LogicalAndExpression", "symbols": ["LogicalAndExpression", "_", (lexer.has("andToken") ? {type: "andToken"} : andToken), "_", "EqualityExpression"], "postprocess": ([left, , , , right]) => ({ type: 'logicalAnd', left, right })},
    {"name": "EqualityExpression", "symbols": ["RelationalExpression"], "postprocess": id},
    {"name": "EqualityExpression", "symbols": ["EqualityExpression", "_", {"literal":"=="}, "_", "RelationalExpression"], "postprocess": ([left, , , , right]) => ({ type: 'equality', left, right })},
    {"name": "EqualityExpression", "symbols": ["EqualityExpression", "_", {"literal":"!="}, "_", "RelationalExpression"], "postprocess": ([left, , , , right]) => ({ type: 'inequality', left, right })},
    {"name": "RelationalExpression", "symbols": ["AdditiveExpression"], "postprocess": id},
    {"name": "RelationalExpression", "symbols": ["RelationalExpression", "_", {"literal":"<="}, "_", "AdditiveExpression"]},
    {"name": "RelationalExpression", "symbols": ["RelationalExpression", "_", {"literal":">="}, "_", "AdditiveExpression"]},
    {"name": "RelationalExpression", "symbols": ["RelationalExpression", "_", {"literal":"<"}, "_", "AdditiveExpression"]},
    {"name": "RelationalExpression", "symbols": ["RelationalExpression", "_", {"literal":">"}, "_", "AdditiveExpression"]},
    {"name": "AdditiveExpression", "symbols": ["MultiplicativeExpression"], "postprocess": id},
    {"name": "AdditiveExpression", "symbols": ["AdditiveExpression", "_", {"literal":"+"}, "_", "MultiplicativeExpression"], "postprocess": ([left, , , , right]) => ({ type: 'add', left, right })},
    {"name": "AdditiveExpression", "symbols": ["AdditiveExpression", "_", {"literal":"-"}, "_", "MultiplicativeExpression"], "postprocess": ([left, , , , right]) => ({ type: 'subtract', left, right })},
    {"name": "MultiplicativeExpression", "symbols": ["UnaryExpression"], "postprocess": id},
    {"name": "MultiplicativeExpression", "symbols": ["MultiplicativeExpression", "_", {"literal":"*"}, "_", "UnaryExpression"], "postprocess": ([left, , , , right]) => ({ type: 'multiply', left, right })},
    {"name": "MultiplicativeExpression", "symbols": ["MultiplicativeExpression", "_", {"literal":"/"}, "_", "UnaryExpression"], "postprocess": ([left, , , , right]) => ({ type: 'divide', left, right })},
    {"name": "MultiplicativeExpression", "symbols": ["MultiplicativeExpression", "_", {"literal":"%"}, "_", "UnaryExpression"], "postprocess": ([left, , , , right]) => ({ type: 'modulo', left, right })},
    {"name": "UnaryExpression", "symbols": ["LeftHandSideExpression"], "postprocess": id},
    {"name": "UnaryExpression", "symbols": [(lexer.has("not") ? {type: "not"} : not), "__", "UnaryExpression"], "postprocess": ([ , , e]) => ({ type: 'logicalNot', e })},
    {"name": "UnaryExpression", "symbols": [{"literal":"-"}, "_", "UnaryExpression"], "postprocess": ([ , , e]) => ({ type: 'negate', e })},
    {"name": "LeftHandSideExpression", "symbols": ["CallExpression"], "postprocess": id},
    {"name": "LeftHandSideExpression", "symbols": ["MemberExpression"], "postprocess": id},
    {"name": "CallExpression", "symbols": ["MemberExpression", "_", "Arguments"], "postprocess": ([target, , args]) => ({ type: 'call', target, args })},
    {"name": "CallExpression", "symbols": ["CallExpression", "_", "Arguments"], "postprocess": ([target, , args]) => ({ type: 'call', target, args })},
    {"name": "CallExpression", "symbols": ["CallExpression", "_", {"literal":"["}, "_", "AssignmentExpression", "_", {"literal":"]"}], "postprocess": ([target, , , , e]) => ({ type: 'index', target, e })},
    {"name": "CallExpression", "symbols": ["CallExpression", "_", {"literal":"."}, "_", "IdentifierName"], "postprocess": ([target, , , , property]) => ({ type: 'property', target, property })},
    {"name": "Arguments", "symbols": [{"literal":"("}, "_", {"literal":")"}], "postprocess": R.always([])},
    {"name": "Arguments", "symbols": [{"literal":"("}, "_", "ArgumentList", "_", {"literal":")"}], "postprocess": R.nth(2)},
    {"name": "ArgumentList", "symbols": ["AssignmentExpression"]},
    {"name": "ArgumentList", "symbols": [(lexer.has("spread") ? {type: "spread"} : spread), "_", "AssignmentExpression"], "postprocess": ([ , , e]) => ([{ type: 'spread', e }])},
    {"name": "ArgumentList", "symbols": ["ArgumentList", "_", {"literal":","}, "_", "AssignmentExpression"], "postprocess": ([list, , , , e]) => ([...list, e])},
    {"name": "ArgumentList", "symbols": ["ArgumentList", "_", {"literal":","}, "_", (lexer.has("spread") ? {type: "spread"} : spread), "_", "AssignmentExpression"], "postprocess": ([list, , , , , , e]) => ([...list, { type: 'spread', e }])},
    {"name": "MemberExpression", "symbols": ["PrimaryExpression"], "postprocess": id},
    {"name": "MemberExpression", "symbols": ["MemberExpression", "_", {"literal":"["}, "_", "AssignmentExpression", "_", {"literal":"]"}], "postprocess": ([target, , , , index]) => ({ type: 'member', target, index })},
    {"name": "MemberExpression", "symbols": ["MemberExpression", "_", {"literal":"."}, "_", "IdentifierName"], "postprocess": ([target, , , , property]) => ({ type: 'property', target, property })},
    {"name": "PrimaryExpression", "symbols": ["IdentifierReference"], "postprocess": id},
    {"name": "PrimaryExpression", "symbols": ["Literal"], "postprocess": id},
    {"name": "PrimaryExpression", "symbols": ["ArrayLiteral"], "postprocess": id},
    {"name": "PrimaryExpression", "symbols": ["ObjectLiteral"], "postprocess": id},
    {"name": "PrimaryExpression", "symbols": ["FunctionExpression"], "postprocess": id},
    {"name": "PrimaryExpression", "symbols": ["ChoiceExpression"], "postprocess": id},
    {"name": "PrimaryExpression", "symbols": ["TableExpression"], "postprocess": id},
    {"name": "PrimaryExpression", "symbols": ["IfExpression"], "postprocess": id},
    {"name": "PrimaryExpression", "symbols": ["WhileExpression"], "postprocess": id},
    {"name": "PrimaryExpression", "symbols": ["UntilExpression"], "postprocess": id},
    {"name": "PrimaryExpression", "symbols": [{"literal":"("}, "_", "AssignmentExpression", "_", {"literal":")"}], "postprocess": R.nth(2)},
    {"name": "IdentifierReference", "symbols": ["Identifier"], "postprocess": id},
    {"name": "Identifier", "symbols": ["IdentifierName"], "postprocess": ([name]) => ({ type: 'identifier', name })},
    {"name": "Literal", "symbols": ["UndefinedLiteral"], "postprocess": id},
    {"name": "Literal", "symbols": ["BooleanLiteral"], "postprocess": id},
    {"name": "Literal", "symbols": ["NumericLiteral"], "postprocess": id},
    {"name": "Literal", "symbols": ["StringLiteral"], "postprocess": id},
    {"name": "Literal", "symbols": ["DiceLiteral"], "postprocess": id},
    {"name": "IfExpression", "symbols": [(lexer.has("ifToken") ? {type: "ifToken"} : ifToken), "_", {"literal":"("}, "_", "AssignmentExpression", "_", {"literal":")"}, "_", "ExpressionBlock", "_", (lexer.has("elseToken") ? {type: "elseToken"} : elseToken), "_", "ExpressionBlock"], "postprocess": ([ , , , , test, , , , ifExpression, , , , elseExpression]) => ({ type: 'if', test, ifExpression, elseExpression })},
    {"name": "IfExpression", "symbols": [(lexer.has("ifToken") ? {type: "ifToken"} : ifToken), "_", {"literal":"("}, "_", "AssignmentExpression", "_", {"literal":")"}, "_", "ExpressionBlock"], "postprocess": ([ , , , , test, , , , ifExpression]) => ({ type: 'if', test, ifExpression })},
    {"name": "WhileExpression", "symbols": [(lexer.has("whileToken") ? {type: "whileToken"} : whileToken), "_", {"literal":"("}, "_", "AssignmentExpression", "_", {"literal":")"}, "_", "ExpressionBlock"], "postprocess": ([ , , , , test, , , , loopBlock ]) => ({ type: 'while', test, loopBlock })},
    {"name": "UntilExpression", "symbols": [(lexer.has("untilToken") ? {type: "untilToken"} : untilToken), "_", {"literal":"("}, "_", "AssignmentExpression", "_", {"literal":")"}, "_", "ExpressionBlock"], "postprocess": ([ , , , , test, , , , loopBlock ]) => ({ type: 'until', test, loopBlock })},
    {"name": "FunctionExpression", "symbols": [(lexer.has("fn") ? {type: "fn"} : fn), "_", {"literal":"("}, "_", "FormalParameters", "_", {"literal":")"}, "_", {"literal":"{"}, "_", "CompoundExpression", "_", {"literal":"}"}], "postprocess": ([ , , , , formalParams, , , , , , body]) => ({ type: 'function', formalParams, body })},
    {"name": "FormalParameters", "symbols": [], "postprocess": R.always([])},
    {"name": "FormalParameters", "symbols": ["FormalParameterList"], "postprocess": id},
    {"name": "FormalParameterList", "symbols": ["FormalParameter"]},
    {"name": "FormalParameterList", "symbols": ["FormalParameterList", "_", {"literal":","}, "_", "FormalParameter"], "postprocess": ([list, , , , p]) => ([...list, p])},
    {"name": "FormalParameter", "symbols": ["BindingElement"], "postprocess": id},
    {"name": "BindingElement", "symbols": ["SingleNameBinding"], "postprocess": id},
    {"name": "BindingElement", "symbols": ["BindingPattern"], "postprocess": id},
    {"name": "SingleNameBinding", "symbols": ["BindingIdentifier"], "postprocess": id},
    {"name": "BindingIdentifier", "symbols": ["Identifier"], "postprocess": id},
    {"name": "BindingPattern", "symbols": ["ObjectBindingPattern"], "postprocess": id},
    {"name": "BindingPattern", "symbols": ["ArrayBindingPattern"], "postprocess": id},
    {"name": "ObjectBindingPattern", "symbols": [{"literal":"{"}, "_", {"literal":"}"}]},
    {"name": "ObjectBindingPattern", "symbols": [{"literal":"{"}, "_", "BindingPropertyList", "_", {"literal":"}"}]},
    {"name": "BindingPropertyList", "symbols": ["BindingProperty"]},
    {"name": "BindingPropertyList", "symbols": ["BindingPropertyList", "_", {"literal":","}, "_", "BindingProperty"]},
    {"name": "BindingProperty", "symbols": ["SingleNameBinding"]},
    {"name": "BindingProperty", "symbols": ["PropertyName", "_", {"literal":":"}, "_", "BindingElement"]},
    {"name": "ArrayBindingPattern", "symbols": [{"literal":"["}, "_", "BindingElementList", "_", {"literal":"]"}]},
    {"name": "BindingElementList", "symbols": ["BindingElement"]},
    {"name": "BindingElementList", "symbols": ["BindingElementList", "_", {"literal":","}, "_", "BindingElement"]},
    {"name": "ChoiceExpression", "symbols": [(lexer.has("choice") ? {type: "choice"} : choice), "_", {"literal":"("}, "_", "FormalParameters", "_", {"literal":")"}, "_", {"literal":"{"}, "_", "ChoiceEntryList", "_", {"literal":"}"}], "postprocess": ([ , , , , formalParams, , , , , , entries]) => ({ type: 'choice', formalParams, entries })},
    {"name": "ChoiceExpression", "symbols": [(lexer.has("choice") ? {type: "choice"} : choice), "_", {"literal":"{"}, "_", "ChoiceEntryList", "_", {"literal":"}"}], "postprocess": ([ , , , , entries]) => ({ type: 'choice', entries })},
    {"name": "ChoiceEntryList", "symbols": ["ChoiceEntry"]},
    {"name": "ChoiceEntryList", "symbols": ["ChoiceEntryList", "__", "ChoiceEntry"], "postprocess": ([list, , e]) => ([...list, e])},
    {"name": "ChoiceEntry", "symbols": [(lexer.has("spread") ? {type: "spread"} : spread), "_", "AssignmentExpression"], "postprocess": R.nth(2)},
    {"name": "ChoiceEntry", "symbols": ["AssignmentExpression"], "postprocess": id},
    {"name": "ChoiceEntry", "symbols": [{"literal":"{"}, "_", "CompoundExpression", "_", {"literal":"}"}], "postprocess": R.nth(2)},
    {"name": "TableExpression", "symbols": [(lexer.has("table") ? {type: "table"} : table), "_", {"literal":"("}, "_", "FormalParameters", "_", {"literal":")"}, "_", {"literal":"{"}, "_", "TableEntries", "_", {"literal":"}"}], "postprocess": ([ , , , , formalParams, , , , , , entries]) => ({ type: 'table', formalParams, entries })},
    {"name": "TableExpression", "symbols": [(lexer.has("table") ? {type: "table"} : table), "_", {"literal":"{"}, "_", "TableEntries", "_", {"literal":"}"}], "postprocess": ([ , , , , entries]) => ({ type: 'table', entries })},
    {"name": "TableEntries", "symbols": [], "postprocess": R.always([])},
    {"name": "TableEntries", "symbols": ["TableEntryList"], "postprocess": id},
    {"name": "TableEntryList", "symbols": ["TableEntry"]},
    {"name": "TableEntryList", "symbols": ["TableEntryList", "__", "TableEntry"], "postprocess": ([list, , e]) => ([...list, e])},
    {"name": "TableEntry", "symbols": ["TableEntrySelector", "_", {"literal":":"}, "_", "AssignmentExpression"], "postprocess": ([selector, , , body]) => ({ type: 'tableEntry', selector, body })},
    {"name": "TableEntry", "symbols": ["TableEntrySelector", "_", {"literal":":"}, "_", {"literal":"{"}, "_", "CompoundExpression", "_", {"literal":"}"}], "postprocess": ([selector, , , , , , body]) => ({ type: 'tableEntry', selector, body })},
    {"name": "TableEntrySelector", "symbols": ["NonZeroDecimalInteger", {"literal":"-"}, "NonZeroDecimalInteger"], "postprocess": ([from, , to]) => ({ type: 'tableEntrySelector', from, to })},
    {"name": "TableEntrySelector", "symbols": ["NonZeroDecimalInteger"], "postprocess": ([n]) => ({ type: 'tableEntrySelector', n })},
    {"name": "DecimalInteger", "symbols": [(lexer.has("decimalInteger") ? {type: "decimalInteger"} : decimalInteger)], "postprocess": ([n]) => parseInt(n, 10)},
    {"name": "NonZeroDecimalInteger", "symbols": [(lexer.has("decimalInteger") ? {type: "decimalInteger"} : decimalInteger)], "postprocess": ([n], _, reject) => { const value = parseInt(n, 10); if (n === 0) { return reject; } return value; }},
    {"name": "UndefinedLiteral", "symbols": [(lexer.has("undefinedToken") ? {type: "undefinedToken"} : undefinedToken)], "postprocess": () => ({ type: 'undefinedLiteral' })},
    {"name": "BooleanLiteral", "symbols": [(lexer.has("true") ? {type: "true"} : true)], "postprocess": () => ({ type: 'boolean', value: true })},
    {"name": "BooleanLiteral", "symbols": [(lexer.has("false") ? {type: "false"} : false)], "postprocess": () => ({ type: 'boolean', value: false })},
    {"name": "ArrayLiteral", "symbols": [{"literal":"["}, "_", {"literal":"]"}], "postprocess": R.always({ type: 'arrayLiteral', elements: [] })},
    {"name": "ArrayLiteral", "symbols": [{"literal":"["}, "_", "ElementList", "_", {"literal":"]"}], "postprocess": ([ , , elements]) => ({ type: 'arrayLiteral', elements })},
    {"name": "ElementList", "symbols": ["AssignmentExpression"]},
    {"name": "ElementList", "symbols": ["ElementList", "_", {"literal":","}, "_", "AssignmentExpression"], "postprocess": ([list, , , , e]) => ([...list, e])},
    {"name": "ObjectLiteral", "symbols": [{"literal":"{"}, "_", {"literal":"}"}], "postprocess": R.always({ type: 'objectLiteral', properties: [] })},
    {"name": "ObjectLiteral", "symbols": [{"literal":"{"}, "_", "PropertyDefinitionList", "_", {"literal":"}"}], "postprocess": ([ , , properties]) => ({ type: 'objectLiteral', properties })},
    {"name": "PropertyDefinitionList", "symbols": ["PropertyDefinition"]},
    {"name": "PropertyDefinitionList", "symbols": ["PropertyDefinitionList", "_", {"literal":","}, "_", "PropertyDefinition"], "postprocess": ([list, , , , e]) => ([...list, e])},
    {"name": "PropertyDefinition", "symbols": ["IdentifierReference"], "postprocess": id},
    {"name": "PropertyDefinition", "symbols": ["PropertyName", "_", {"literal":":"}, "_", "AssignmentExpression"], "postprocess": ([name, , , , e]) => ({ type: 'property', name, e })},
    {"name": "PropertyDefinition", "symbols": [(lexer.has("spread") ? {type: "spread"} : spread), "_", "AssignmentExpression"], "postprocess": ([ , , e]) => ({ type: 'spreadProperty', e })},
    {"name": "PropertyName", "symbols": ["LiteralPropertyName"], "postprocess": id},
    {"name": "PropertyName", "symbols": ["ComputedPropertyName"], "postprocess": id},
    {"name": "LiteralPropertyName", "symbols": ["IdentifierName"], "postprocess": id},
    {"name": "LiteralPropertyName", "symbols": ["StringLiteral"], "postprocess": id},
    {"name": "LiteralPropertyName", "symbols": ["NumericLiteral"], "postprocess": id},
    {"name": "ComputedPropertyName", "symbols": [{"literal":"["}, "_", "AssignmentExpression", "_", {"literal":"]"}], "postprocess": ([ , , e]) => ({ type: 'computedPropertyName', e })},
    {"name": "DiceLiteral", "symbols": [(lexer.has("dice") ? {type: "dice"} : dice)], "postprocess": ([dice]) => ({ type: 'diceLiteral', dice: dice.value })},
    {"name": "DiceLiteralSuffix$ebnf$1", "symbols": ["NonZeroDecimalInteger"], "postprocess": id},
    {"name": "DiceLiteralSuffix$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "DiceLiteralSuffix", "symbols": [/[+-]/, /[lLhH]/, "DiceLiteralSuffix$ebnf$1"]},
    {"name": "NumericLiteral", "symbols": [(lexer.has("decimal") ? {type: "decimal"} : decimal)], "postprocess": ([n]) => ({ type: 'numericLiteral', value: parseFloat(n) })},
    {"name": "NumericLiteral", "symbols": [(lexer.has("decimalInteger") ? {type: "decimalInteger"} : decimalInteger)], "postprocess": ([n]) => ({ type: 'numericLiteral', value: parseInt(n, 10) })},
    {"name": "IdentifierName", "symbols": [(lexer.has("identifierName") ? {type: "identifierName"} : identifierName)], "postprocess": R.compose(R.prop('value'), R.nth(0))},
    {"name": "StringLiteral", "symbols": [(lexer.has("doubleQuoteString") ? {type: "doubleQuoteString"} : doubleQuoteString)], "postprocess": ([data]) => ({ type: 'stringLiteral', s: data.value })},
    {"name": "StringLiteral", "symbols": [(lexer.has("singleQuoteString") ? {type: "singleQuoteString"} : singleQuoteString)], "postprocess": ([data]) => ({ type: 'stringLiteral', s: data.value })},
    {"name": "_", "symbols": []},
    {"name": "_", "symbols": ["_", (lexer.has("whitespace") ? {type: "whitespace"} : whitespace)], "postprocess": R.always(null)},
    {"name": "_", "symbols": ["_", (lexer.has("comment") ? {type: "comment"} : comment)], "postprocess": R.always(null)},
    {"name": "__", "symbols": [(lexer.has("whitespace") ? {type: "whitespace"} : whitespace)], "postprocess": R.always(null)},
    {"name": "__", "symbols": ["__", (lexer.has("whitespace") ? {type: "whitespace"} : whitespace)], "postprocess": R.always(null)},
    {"name": "__", "symbols": ["__", (lexer.has("comment") ? {type: "comment"} : comment)], "postprocess": R.always(null)}
]
  , ParserStart: "Start"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
