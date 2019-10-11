// Generated automatically by nearley, version 2.19.0
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

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
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", "wschar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "__$ebnf$1", "symbols": ["wschar"]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", "wschar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__", "symbols": ["__$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "wschar", "symbols": [/[ \t\n\v\f]/], "postprocess": id},
    {"name": "Start$ebnf$1", "symbols": []},
    {"name": "Start$ebnf$1", "symbols": ["Start$ebnf$1", "Expression"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Start", "symbols": ["_", "Start$ebnf$1"], "postprocess": R.compose(R.flatten, R.nth(1))},
    {"name": "ExpressionList", "symbols": ["Expression"]},
    {"name": "ExpressionList", "symbols": ["ExpressionList", "__", "Expression"]},
    {"name": "Expression", "symbols": ["AssignmentExpression"], "postprocess": id},
    {"name": "Expression", "symbols": [{"literal":"{"}, "_", "ExpressionList", "_", {"literal":"}"}], "postprocess": R.nth(2)},
    {"name": "AssignmentExpression", "symbols": ["ConditionalExpression"], "postprocess": id},
    {"name": "AssignmentExpression", "symbols": ["LeftHandSideExpression", "_", {"literal":"="}, "_", "ConditionalExpression"], "postprocess": ([left, , , , right]) => ({ type: 'assign', op: '=', left, right })},
    {"name": "AssignmentExpression", "symbols": ["LeftHandSideExpression", "_", "AssignmentOperator", "_", "ConditionalExpression"], "postprocess": ([left, , op, , right]) => ({ type: 'assign', op, left, right })},
    {"name": "AssignmentOperator$string$1", "symbols": [{"literal":"+"}, {"literal":"="}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "AssignmentOperator", "symbols": ["AssignmentOperator$string$1"], "postprocess": id},
    {"name": "AssignmentOperator$string$2", "symbols": [{"literal":"-"}, {"literal":"="}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "AssignmentOperator", "symbols": ["AssignmentOperator$string$2"], "postprocess": id},
    {"name": "AssignmentOperator$string$3", "symbols": [{"literal":"*"}, {"literal":"="}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "AssignmentOperator", "symbols": ["AssignmentOperator$string$3"], "postprocess": id},
    {"name": "AssignmentOperator$string$4", "symbols": [{"literal":"/"}, {"literal":"="}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "AssignmentOperator", "symbols": ["AssignmentOperator$string$4"], "postprocess": id},
    {"name": "AssignmentOperator$string$5", "symbols": [{"literal":"%"}, {"literal":"="}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "AssignmentOperator", "symbols": ["AssignmentOperator$string$5"], "postprocess": id},
    {"name": "LeftHandSideExpression", "symbols": ["MemberExpression"], "postprocess": id},
    {"name": "LeftHandSideExpression", "symbols": ["CallExpression"], "postprocess": id},
    {"name": "MemberExpression", "symbols": ["PrimaryExpression"], "postprocess": id},
    {"name": "MemberExpression", "symbols": ["MemberExpression", "_", {"literal":"["}, "_", "Expression", "_", {"literal":"]"}]},
    {"name": "MemberExpression", "symbols": ["MemberExpression", "_", {"literal":"."}, "_", "IdentifierName"]},
    {"name": "CallExpression", "symbols": ["CallExpression", "_", "Arguments"], "postprocess": ([target, , args]) => ({ type: 'call', target, args })},
    {"name": "CallExpression", "symbols": ["CallExpression", "_", {"literal":"["}, "_", "Expression", "_", {"literal":"]"}], "postprocess": ([target, , , , e]) => ({ type: 'index', target, e })},
    {"name": "CallExpression", "symbols": ["CallExpression", "_", {"literal":"."}, "_", "IdentifierName"], "postprocess": ([target, , , , property]) => ({ type: 'property', target, property })},
    {"name": "Arguments", "symbols": [{"literal":"("}, "_", {"literal":")"}], "postprocess": R.always([])},
    {"name": "Arguments", "symbols": [{"literal":"("}, "_", "ArgumentList", "_", {"literal":")"}], "postprocess": R.nth(2)},
    {"name": "ArgumentList", "symbols": ["AssignmentExpression"], "postprocess": id},
    {"name": "ArgumentList", "symbols": ["ArgumentList", "_", {"literal":","}, "_", "AssignmentExpression"], "postprocess": ([list, , , , e]) => ([...list, e])},
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
    {"name": "IdentifierReference", "symbols": ["Identifier"], "postprocess": id},
    {"name": "Identifier", "symbols": ["IdentifierName"], "postprocess": 
        (data, _, reject) => {
          if (R.includes(data.join(''), reservedWords)) {
            return reject;
          }
          return {
            type: 'identifier',
            name: data.join(''),
          };
        }
        },
    {"name": "Literal", "symbols": ["UndefinedLiteral"], "postprocess": id},
    {"name": "Literal", "symbols": ["BooleanLiteral"], "postprocess": id},
    {"name": "Literal", "symbols": ["NumericLiteral"], "postprocess": id},
    {"name": "Literal", "symbols": ["StringLiteral"], "postprocess": id},
    {"name": "Literal", "symbols": ["DiceLiteral"], "postprocess": id},
    {"name": "ConditionalExpression", "symbols": ["LogicalOrExpression"], "postprocess": id},
    {"name": "ConditionalExpression", "symbols": ["LogicalOrExpression", "_", {"literal":"?"}, "_", "AssignmentExpression", "_", {"literal":":"}, "_", "AssignmentExpression"]},
    {"name": "LogicalOrExpression", "symbols": ["LogicalAndExpression"], "postprocess": id},
    {"name": "LogicalOrExpression$string$1", "symbols": [{"literal":"o"}, {"literal":"r"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "LogicalOrExpression", "symbols": ["LogicalOrExpression", "_", "LogicalOrExpression$string$1", "_", "LogicalAndExpression"]},
    {"name": "LogicalAndExpression", "symbols": ["EqualityExpression"], "postprocess": id},
    {"name": "LogicalAndExpression$string$1", "symbols": [{"literal":"a"}, {"literal":"n"}, {"literal":"d"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "LogicalAndExpression", "symbols": ["LogicalAndExpression", "_", "LogicalAndExpression$string$1", "_", "EqualityExpression"]},
    {"name": "EqualityExpression", "symbols": ["RelationalExpression"], "postprocess": id},
    {"name": "EqualityExpression$string$1", "symbols": [{"literal":"="}, {"literal":"="}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "EqualityExpression", "symbols": ["EqualityExpression", "_", "EqualityExpression$string$1", "_", "RelationalExpression"]},
    {"name": "EqualityExpression$string$2", "symbols": [{"literal":"!"}, {"literal":"="}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "EqualityExpression", "symbols": ["EqualityExpression", "_", "EqualityExpression$string$2", "_", "RelationalExpression"]},
    {"name": "RelationalExpression", "symbols": ["AdditiveExpression"], "postprocess": id},
    {"name": "RelationalExpression$string$1", "symbols": [{"literal":"<"}, {"literal":"="}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "RelationalExpression", "symbols": ["RelationalExpression", "_", "RelationalExpression$string$1", "_", "AdditiveExpression"]},
    {"name": "RelationalExpression$string$2", "symbols": [{"literal":">"}, {"literal":"="}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "RelationalExpression", "symbols": ["RelationalExpression", "_", "RelationalExpression$string$2", "_", "AdditiveExpression"]},
    {"name": "RelationalExpression", "symbols": ["RelationalExpression", "_", {"literal":"<"}, "_", "AdditiveExpression"]},
    {"name": "RelationalExpression", "symbols": ["RelationalExpression", "_", {"literal":">"}, "_", "AdditiveExpression"]},
    {"name": "AdditiveExpression", "symbols": ["MultiplicativeExpression"], "postprocess": id},
    {"name": "AdditiveExpression", "symbols": ["AdditiveExpression", "_", {"literal":"+"}, "_", "MultiplicativeExpression"], "postprocess": ([left, , , , right]) => ({ type: 'add', left, right })},
    {"name": "AdditiveExpression", "symbols": ["AdditiveExpression", "_", {"literal":"-"}, "_", "MultiplicativeExpression"]},
    {"name": "MultiplicativeExpression", "symbols": ["UnaryExpression"], "postprocess": id},
    {"name": "MultiplicativeExpression", "symbols": ["MultiplicativeExpression", "_", {"literal":"*"}, "_", "UnaryExpression"]},
    {"name": "MultiplicativeExpression", "symbols": ["MultiplicativeExpression", "_", {"literal":"/"}, "_", "UnaryExpression"]},
    {"name": "MultiplicativeExpression", "symbols": ["MultiplicativeExpression", "_", {"literal":"%"}, "_", "UnaryExpression"]},
    {"name": "UnaryExpression", "symbols": ["LeftHandSideExpression"], "postprocess": id},
    {"name": "UnaryExpression$string$1", "symbols": [{"literal":"n"}, {"literal":"o"}, {"literal":"t"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "UnaryExpression", "symbols": ["UnaryExpression$string$1", "__", "UnaryExpression"]},
    {"name": "UnaryExpression", "symbols": [{"literal":"-"}, "_", "UnaryExpression"]},
    {"name": "SpreadExpression$string$1", "symbols": [{"literal":"."}, {"literal":"."}, {"literal":"."}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "SpreadExpression", "symbols": ["SpreadExpression$string$1", "Expression"]},
    {"name": "IfExpression$string$1", "symbols": [{"literal":"i"}, {"literal":"f"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "IfExpression$string$2", "symbols": [{"literal":"e"}, {"literal":"l"}, {"literal":"s"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "IfExpression", "symbols": ["IfExpression$string$1", "_", {"literal":"("}, "_", "Expression", "_", {"literal":")"}, "_", "Expression", "_", "IfExpression$string$2", "_", "Expression"]},
    {"name": "IfExpression$string$3", "symbols": [{"literal":"i"}, {"literal":"f"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "IfExpression", "symbols": ["IfExpression$string$3", "_", {"literal":"("}, "_", "Expression", "_", {"literal":")"}, "_", "Expression"]},
    {"name": "WhileExpression$string$1", "symbols": [{"literal":"w"}, {"literal":"h"}, {"literal":"i"}, {"literal":"l"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "WhileExpression", "symbols": ["WhileExpression$string$1", "_", {"literal":"("}, "_", "Expression", "_", {"literal":")"}, "_", "Expression"]},
    {"name": "UntilExpression$string$1", "symbols": [{"literal":"u"}, {"literal":"n"}, {"literal":"t"}, {"literal":"i"}, {"literal":"l"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "UntilExpression", "symbols": ["UntilExpression$string$1", "_", {"literal":"("}, "_", "Expression", "_", {"literal":")"}, "_", "Expression"]},
    {"name": "FunctionExpression$string$1", "symbols": [{"literal":"f"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "FunctionExpression", "symbols": ["FunctionExpression$string$1", "_", {"literal":"("}, "_", "FormalParameters", "_", {"literal":")"}, "_", {"literal":"{"}, "_", "FunctionBody", "_", {"literal":"}"}]},
    {"name": "FormalParameters", "symbols": []},
    {"name": "FormalParameters", "symbols": ["FormalParameterList"]},
    {"name": "FormalParameterList", "symbols": ["FormalParameter"]},
    {"name": "FormalParameterList", "symbols": ["FormalParameterList", "_", {"literal":","}, "_", "FormalParameter"]},
    {"name": "FormalParameter", "symbols": ["BindingElement"]},
    {"name": "BindingElement", "symbols": ["SingleNameBinding"]},
    {"name": "BindingElement", "symbols": ["BindingPattern"]},
    {"name": "SingleNameBinding", "symbols": ["BindingIdentifier"]},
    {"name": "BindingIdentifier", "symbols": ["Identifier"]},
    {"name": "BindingPattern", "symbols": ["ObjectBindingPattern"]},
    {"name": "BindingPattern", "symbols": ["ArrayBindingPattern"]},
    {"name": "ObjectBindingPattern", "symbols": [{"literal":"{"}, "_", {"literal":"}"}]},
    {"name": "ObjectBindingPattern", "symbols": [{"literal":"{"}, "_", "BindingPropertyList", "_", {"literal":"}"}]},
    {"name": "BindingPropertyList", "symbols": ["BindingProperty"]},
    {"name": "BindingPropertyList", "symbols": ["BindingPropertyList", "_", {"literal":","}, "_", "BindingProperty"]},
    {"name": "BindingProperty", "symbols": ["SingleNameBinding"]},
    {"name": "BindingProperty", "symbols": ["PropertyName", "_", {"literal":":"}, "_", "BindingElement"]},
    {"name": "ArrayBindingPattern", "symbols": [{"literal":"["}, "_", "BindingElementList", "_", {"literal":"]"}]},
    {"name": "BindingElementList", "symbols": ["BindingElement"]},
    {"name": "BindingElementList", "symbols": ["BindingElementList", "_", {"literal":","}, "_", "BindingElement"]},
    {"name": "FunctionBody", "symbols": ["FunctionExpressionList"]},
    {"name": "FunctionExpressionList", "symbols": ["ExpressionList"]},
    {"name": "ChoiceExpression$string$1", "symbols": [{"literal":"c"}, {"literal":"h"}, {"literal":"o"}, {"literal":"i"}, {"literal":"c"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "ChoiceExpression$ebnf$1$subexpression$1", "symbols": [{"literal":"("}, "_", "FormalParameters", "_", {"literal":")"}, "_"]},
    {"name": "ChoiceExpression$ebnf$1", "symbols": ["ChoiceExpression$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "ChoiceExpression$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "ChoiceExpression", "symbols": ["ChoiceExpression$string$1", "_", "ChoiceExpression$ebnf$1", {"literal":"{"}, "_", "ChoiceEntryList", "_", {"literal":"}"}]},
    {"name": "ChoiceEntryList", "symbols": ["ChoiceEntry"]},
    {"name": "ChoiceEntryList", "symbols": ["ChoiceEntryList", "__", "ChoiceEntry"]},
    {"name": "ChoiceEntry", "symbols": ["SpreadExpression"], "postprocess": id},
    {"name": "ChoiceEntry", "symbols": ["TableEntryBody"], "postprocess": id},
    {"name": "TableExpression$string$1", "symbols": [{"literal":"t"}, {"literal":"a"}, {"literal":"b"}, {"literal":"l"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "TableExpression$ebnf$1$subexpression$1", "symbols": [{"literal":"("}, "_", "FormalParameters", "_", {"literal":")"}, "_"]},
    {"name": "TableExpression$ebnf$1", "symbols": ["TableExpression$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "TableExpression$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "TableExpression", "symbols": ["TableExpression$string$1", "_", "TableExpression$ebnf$1", {"literal":"{"}, "_", "TableEntryList", "_", {"literal":"}"}]},
    {"name": "TableEntryList", "symbols": ["TableEntry"]},
    {"name": "TableEntryList", "symbols": ["TableEntryList", "__", "TableEntry"]},
    {"name": "TableEntry", "symbols": ["TableEntrySelector", {"literal":":"}, "_", "TableEntryBody"]},
    {"name": "TableEntrySelector", "symbols": ["NonZeroDecimalInteger", {"literal":"-"}, "NonZeroDecimalInteger"]},
    {"name": "TableEntrySelector", "symbols": ["NonZeroDecimalInteger"]},
    {"name": "TableEntryBody", "symbols": ["Expression"]},
    {"name": "TableEntryBody", "symbols": [{"literal":"{"}, "_", "ExpressionList", "_", {"literal":"}"}]},
    {"name": "UndefinedLiteral$string$1", "symbols": [{"literal":"u"}, {"literal":"n"}, {"literal":"d"}, {"literal":"e"}, {"literal":"f"}, {"literal":"i"}, {"literal":"n"}, {"literal":"e"}, {"literal":"d"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "UndefinedLiteral", "symbols": ["UndefinedLiteral$string$1"], "postprocess": () => createUndefinedLiteral()},
    {"name": "BooleanLiteral$string$1", "symbols": [{"literal":"t"}, {"literal":"r"}, {"literal":"u"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "BooleanLiteral", "symbols": ["BooleanLiteral$string$1"], "postprocess": () => ({ type: 'boolean', value: true })},
    {"name": "BooleanLiteral$string$2", "symbols": [{"literal":"f"}, {"literal":"a"}, {"literal":"l"}, {"literal":"s"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "BooleanLiteral", "symbols": ["BooleanLiteral$string$2"], "postprocess": () => ({ type: 'boolean', value: false })},
    {"name": "ArrayLiteral", "symbols": [{"literal":"["}, "_", "ElementList", "_", {"literal":"]"}]},
    {"name": "ElementList", "symbols": ["AssignmentExpression"], "postprocess": id},
    {"name": "ElementList", "symbols": ["ElementList", "_", {"literal":","}, "_", "AssignmentExpression"], "postprocess": ([list, , , , e]) => ([...list, e])},
    {"name": "ObjectLiteral", "symbols": [{"literal":"{"}, "_", "PropertyDefinitionList", "_", {"literal":"}"}]},
    {"name": "PropertyDefinitionList", "symbols": ["PropertyDefinition"]},
    {"name": "PropertyDefinitionList", "symbols": ["PropertyDefinitionList", "_", {"literal":","}, "_", "PropertyDefinition"]},
    {"name": "PropertyDefinition", "symbols": ["IdentifierReference"]},
    {"name": "PropertyDefinition", "symbols": ["PropertyName", "_", {"literal":":"}, "_", "AssignmentExpression"]},
    {"name": "PropertyDefinition$string$1", "symbols": [{"literal":"."}, {"literal":"."}, {"literal":"."}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "PropertyDefinition", "symbols": ["PropertyDefinition$string$1", "_", "AssignmentExpression"]},
    {"name": "PropertyName", "symbols": ["LiteralPropertyName"]},
    {"name": "PropertyName", "symbols": ["ComputedPropertyName"]},
    {"name": "LiteralPropertyName", "symbols": ["IdentifierName"]},
    {"name": "LiteralPropertyName", "symbols": ["StringLiteral"]},
    {"name": "LiteralPropertyName", "symbols": ["NumericLiteral"]},
    {"name": "ComputedPropertyName", "symbols": [{"literal":"["}, "_", "AssignmentExpression", "_", {"literal":"]"}]},
    {"name": "DiceLiteral$ebnf$1", "symbols": ["NonZeroDecimalInteger"], "postprocess": id},
    {"name": "DiceLiteral$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "DiceLiteral$subexpression$1", "symbols": [/[dD]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "DiceLiteral$ebnf$2", "symbols": ["DiceLiteralSuffix"], "postprocess": id},
    {"name": "DiceLiteral$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "DiceLiteral", "symbols": ["DiceLiteral$ebnf$1", "DiceLiteral$subexpression$1", "NonZeroDecimalInteger", "DiceLiteral$ebnf$2"]},
    {"name": "DiceLiteralSuffix$ebnf$1", "symbols": ["NonZeroDecimalInteger"], "postprocess": id},
    {"name": "DiceLiteralSuffix$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "DiceLiteralSuffix", "symbols": [/[+-]/, /[lLhH]/, "DiceLiteralSuffix$ebnf$1"]},
    {"name": "LineTerminator", "symbols": [{"literal":"\n"}]},
    {"name": "LineTerminator$string$1", "symbols": [{"literal":"\r"}, {"literal":"\n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "LineTerminator", "symbols": ["LineTerminator$string$1"]},
    {"name": "LineTerminator", "symbols": [{"literal":"\r"}]},
    {"name": "Comment$ebnf$1", "symbols": []},
    {"name": "Comment$ebnf$1", "symbols": ["Comment$ebnf$1", /[^\n(\r\n)\r]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Comment", "symbols": [{"literal":"#"}, "Comment$ebnf$1"]},
    {"name": "NumericLiteral", "symbols": ["DecimalLiteral"]},
    {"name": "DecimalLiteral", "symbols": ["DecimalIntegerLiteral", {"literal":"."}, "DecimalDigits"]},
    {"name": "DecimalLiteral", "symbols": [{"literal":"."}, "DecimalDigits"]},
    {"name": "DecimalLiteral", "symbols": ["DecimalIntegerLiteral"]},
    {"name": "DecimalIntegerLiteral", "symbols": [{"literal":"0"}], "postprocess": () => 0},
    {"name": "DecimalIntegerLiteral", "symbols": ["NonZeroDecimalInteger"], "postprocess": id},
    {"name": "NonZeroDecimalInteger", "symbols": ["NonZeroDigit", "DecimalDigits"], "postprocess": ([head, tail]) => parseInt(`${head}${tail}`, 10)},
    {"name": "DecimalDigits", "symbols": ["DecimalDigit"]},
    {"name": "DecimalDigits", "symbols": ["DecimalDigits", "DecimalDigit"]},
    {"name": "NonZeroDigit", "symbols": [/[1-9]/], "postprocess": id},
    {"name": "DecimalDigit", "symbols": [/[0-9]/], "postprocess": id},
    {"name": "IdentifierName", "symbols": ["IdentifierStart"], "postprocess": id},
    {"name": "IdentifierName", "symbols": ["IdentifierName", "IdentifierPart"], "postprocess": ([head, tail]) => `${head}${tail}`},
    {"name": "IdentifierStart", "symbols": [/[_a-zA-Z]/], "postprocess": id},
    {"name": "IdentifierPart", "symbols": [/[_a-zA-Z0-9]/], "postprocess": id},
    {"name": "StringLiteral$ebnf$1", "symbols": []},
    {"name": "StringLiteral$ebnf$1", "symbols": ["StringLiteral$ebnf$1", "SingleQuoteStringCharacter"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "StringLiteral", "symbols": [{"literal":"'"}, "StringLiteral$ebnf$1", {"literal":"'"}], "postprocess": ([_, cs]) => cs.join('')},
    {"name": "StringLiteral$ebnf$2", "symbols": []},
    {"name": "StringLiteral$ebnf$2", "symbols": ["StringLiteral$ebnf$2", "DoubleQuoteStringCharacter"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "StringLiteral", "symbols": [{"literal":"\""}, "StringLiteral$ebnf$2", {"literal":"\""}], "postprocess": ([_, cs]) => cs.join('')},
    {"name": "DoubleQuoteStringCharacter$string$1", "symbols": [{"literal":"\\"}, {"literal":"\""}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "DoubleQuoteStringCharacter", "symbols": ["DoubleQuoteStringCharacter$string$1"], "postprocess": id},
    {"name": "DoubleQuoteStringCharacter", "symbols": [/[^"]/], "postprocess": id},
    {"name": "SingleQuoteStringCharacter$string$1", "symbols": [{"literal":"\\"}, {"literal":"'"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "SingleQuoteStringCharacter", "symbols": ["SingleQuoteStringCharacter$string$1"], "postprocess": id},
    {"name": "SingleQuoteStringCharacter", "symbols": [/[^']/], "postprocess": id}
]
  , ParserStart: "Start"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
