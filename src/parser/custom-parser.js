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
    {"name": "Block$ebnf$1", "symbols": []},
    {"name": "Block$ebnf$1", "symbols": ["Block$ebnf$1", "Expression"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Block", "symbols": [{"literal":"{"}, "_", "Block$ebnf$1", "_", {"literal":"}"}, "_"], "postprocess": R.nth(1)},
    {"name": "Expression", "symbols": ["Block"], "postprocess": id},
    {"name": "Expression", "symbols": ["_", "AssignmentExpression", "__"], "postprocess": R.nth(1)},
    {"name": "AssignmentExpression", "symbols": ["LeftHandSideExpression", "_", {"literal":"="}, "_", "ConditionalExpression"], "postprocess": ([left, , , , right]) => ({ type: 'assign', left, right })},
    {"name": "AssignmentExpression$string$1", "symbols": [{"literal":"+"}, {"literal":"="}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "AssignmentExpression", "symbols": ["LeftHandSideExpression", "_", "AssignmentExpression$string$1", "_", "ConditionalExpression"], "postprocess": ([left, , , , right]) => ({ type: 'plusEquals', left, right })},
    {"name": "AssignmentExpression$string$2", "symbols": [{"literal":"-"}, {"literal":"="}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "AssignmentExpression", "symbols": ["LeftHandSideExpression", "_", "AssignmentExpression$string$2", "_", "ConditionalExpression"], "postprocess": ([left, , , , right]) => ({ type: 'minusEquals', left, right })},
    {"name": "AssignmentExpression$string$3", "symbols": [{"literal":"*"}, {"literal":"="}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "AssignmentExpression", "symbols": ["LeftHandSideExpression", "_", "AssignmentExpression$string$3", "_", "ConditionalExpression"], "postprocess": ([left, , , , right]) => ({ type: 'timesEquals', left, right })},
    {"name": "AssignmentExpression$string$4", "symbols": [{"literal":"/"}, {"literal":"="}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "AssignmentExpression", "symbols": ["LeftHandSideExpression", "_", "AssignmentExpression$string$4", "_", "ConditionalExpression"], "postprocess": ([left, , , , right]) => ({ type: 'divideEquals', left, right })},
    {"name": "AssignmentExpression$string$5", "symbols": [{"literal":"%"}, {"literal":"%"}, {"literal":"="}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "AssignmentExpression", "symbols": ["LeftHandSideExpression", "_", "AssignmentExpression$string$5", "_", "ConditionalExpression"], "postprocess": ([left, , , , right]) => ({ type: 'modEquals', left, right })},
    {"name": "AssignmentExpression", "symbols": ["ConditionalExpression"], "postprocess": id},
    {"name": "LeftHandSideExpression", "symbols": ["CallExpression"], "postprocess": id},
    {"name": "CallExpression", "symbols": ["CallExpression", "_", "Arguments"], "postprocess": ([target, , args]) => { console.log('yup'); return ({ type: 'call', target, args }); }},
    {"name": "CallExpression", "symbols": ["CallExpression", "_", {"literal":"["}, "_", "Expression", "_", {"literal":"]"}], "postprocess": ([target, , , , e]) => ({ type: 'index', target, e })},
    {"name": "CallExpression", "symbols": ["CallExpression", "_", {"literal":"."}, "_", "IdentifierName"], "postprocess": ([target, , , , property]) => ({ type: 'property', target, property })},
    {"name": "CallExpression", "symbols": ["MemberExpression"], "postprocess": id},
    {"name": "Arguments", "symbols": [{"literal":"("}, "_", {"literal":")"}], "postprocess": R.always([])},
    {"name": "Arguments", "symbols": [{"literal":"("}, "_", "ArgumentList", "_", {"literal":")"}], "postprocess": R.nth(2)},
    {"name": "ArgumentList", "symbols": ["AssignmentExpression"], "postprocess": id},
    {"name": "ArgumentList", "symbols": ["ArgumentList", "_", {"literal":","}, "_", "AssignmentExpression"], "postprocess": ([list, , , , e]) => ([...list, e])},
    {"name": "MemberExpression", "symbols": ["MemberExpression", "_", {"literal":"["}, "_", "Expression", "_", {"literal":"]"}]},
    {"name": "MemberExpression", "symbols": ["MemberExpression", "_", {"literal":"."}, "_", "Identifier"]},
    {"name": "MemberExpression", "symbols": ["PrimaryExpression"], "postprocess": id},
    {"name": "PrimaryExpression", "symbols": ["Literal"], "postprocess": id},
    {"name": "PrimaryExpression", "symbols": ["Identifier"], "postprocess": id},
    {"name": "PrimaryExpression", "symbols": ["FunctionExpression"], "postprocess": id},
    {"name": "PrimaryExpression", "symbols": ["ChoiceExpression"], "postprocess": id},
    {"name": "PrimaryExpression", "symbols": ["TableExpression"], "postprocess": id},
    {"name": "PrimaryExpression", "symbols": [{"literal":"("}, "_", "AdditiveExpression", "_", {"literal":")"}], "postprocess": R.nth(2)},
    {"name": "PrimaryExpression", "symbols": ["IfExpression"], "postprocess": id},
    {"name": "PrimaryExpression", "symbols": ["WhileExpression"], "postprocess": id},
    {"name": "PrimaryExpression", "symbols": ["UntilExpression"], "postprocess": id},
    {"name": "PrimaryExpression", "symbols": ["SpreadExpression"], "postprocess": id},
    {"name": "ConditionalExpression", "symbols": ["ConditionalExpression", "_", {"literal":"?"}, "_", "Expression", "_", {"literal":":"}, "_", "Expression"]},
    {"name": "ConditionalExpression", "symbols": ["LogicalOrExpression"], "postprocess": id},
    {"name": "LogicalOrExpression$string$1", "symbols": [{"literal":"o"}, {"literal":"r"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "LogicalOrExpression", "symbols": ["LogicalOrExpression", "_", "LogicalOrExpression$string$1", "_", "LogicalAndExpression"]},
    {"name": "LogicalOrExpression", "symbols": ["LogicalAndExpression"], "postprocess": id},
    {"name": "LogicalAndExpression$string$1", "symbols": [{"literal":"a"}, {"literal":"n"}, {"literal":"d"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "LogicalAndExpression", "symbols": ["LogicalAndExpression", "_", "LogicalAndExpression$string$1", "_", "EqualityExpression"]},
    {"name": "LogicalAndExpression", "symbols": ["EqualityExpression"], "postprocess": id},
    {"name": "EqualityExpression$string$1", "symbols": [{"literal":"="}, {"literal":"="}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "EqualityExpression", "symbols": ["EqualityExpression", "_", "EqualityExpression$string$1", "_", "RelationalExpression"]},
    {"name": "EqualityExpression$string$2", "symbols": [{"literal":"!"}, {"literal":"="}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "EqualityExpression", "symbols": ["EqualityExpression", "_", "EqualityExpression$string$2", "_", "RelationalExpression"]},
    {"name": "EqualityExpression", "symbols": ["RelationalExpression"], "postprocess": id},
    {"name": "RelationalExpression$string$1", "symbols": [{"literal":"<"}, {"literal":"="}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "RelationalExpression", "symbols": ["RelationalExpression", "_", "RelationalExpression$string$1", "_", "AdditiveExpression"]},
    {"name": "RelationalExpression$string$2", "symbols": [{"literal":">"}, {"literal":"="}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "RelationalExpression", "symbols": ["RelationalExpression", "_", "RelationalExpression$string$2", "_", "AdditiveExpression"]},
    {"name": "RelationalExpression", "symbols": ["RelationalExpression", "_", {"literal":"<"}, "_", "AdditiveExpression"]},
    {"name": "RelationalExpression", "symbols": ["RelationalExpression", "_", {"literal":">"}, "_", "AdditiveExpression"]},
    {"name": "RelationalExpression", "symbols": ["AdditiveExpression"], "postprocess": id},
    {"name": "AdditiveExpression", "symbols": ["AdditiveExpression", "_", {"literal":"+"}, "_", "MultiplicativeExpression"], "postprocess": ([left, , , , right]) => ({ type: 'add', left, right })},
    {"name": "AdditiveExpression", "symbols": ["AdditiveExpression", "_", {"literal":"-"}, "_", "MultiplicativeExpression"]},
    {"name": "AdditiveExpression", "symbols": ["MultiplicativeExpression"], "postprocess": id},
    {"name": "MultiplicativeExpression", "symbols": ["MultiplicativeExpression", "_", {"literal":"*"}, "_", "UnaryExpression"]},
    {"name": "MultiplicativeExpression", "symbols": ["MultiplicativeExpression", "_", {"literal":"/"}, "_", "UnaryExpression"]},
    {"name": "MultiplicativeExpression", "symbols": ["UnaryExpression"], "postprocess": id},
    {"name": "UnaryExpression$string$1", "symbols": [{"literal":"n"}, {"literal":"o"}, {"literal":"t"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "UnaryExpression", "symbols": ["UnaryExpression$string$1", "__", "PrimaryExpression"]},
    {"name": "UnaryExpression", "symbols": [{"literal":"-"}, "_", "PrimaryExpression"]},
    {"name": "UnaryExpression", "symbols": ["PrimaryExpression"], "postprocess": id},
    {"name": "SpreadExpression$string$1", "symbols": [{"literal":"."}, {"literal":"."}, {"literal":"."}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "SpreadExpression", "symbols": ["SpreadExpression$string$1", "Expression"]},
    {"name": "IfExpression$string$1", "symbols": [{"literal":"i"}, {"literal":"f"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "IfExpression$ebnf$1$subexpression$1$string$1", "symbols": [{"literal":"e"}, {"literal":"l"}, {"literal":"s"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "IfExpression$ebnf$1$subexpression$1", "symbols": ["_", "IfExpression$ebnf$1$subexpression$1$string$1", "_", "Expression"]},
    {"name": "IfExpression$ebnf$1", "symbols": ["IfExpression$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "IfExpression$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "IfExpression", "symbols": ["IfExpression$string$1", "_", {"literal":"("}, "_", "Expression", "_", {"literal":")"}, "_", "Expression", "IfExpression$ebnf$1"]},
    {"name": "WhileExpression$string$1", "symbols": [{"literal":"w"}, {"literal":"h"}, {"literal":"i"}, {"literal":"l"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "WhileExpression", "symbols": ["WhileExpression$string$1", "_", {"literal":"("}, "_", "Expression", "_", {"literal":")"}, "_", "Expression"]},
    {"name": "UntilExpression$string$1", "symbols": [{"literal":"u"}, {"literal":"n"}, {"literal":"t"}, {"literal":"i"}, {"literal":"l"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "UntilExpression", "symbols": ["UntilExpression$string$1", "_", {"literal":"("}, "_", "Expression", "_", {"literal":")"}, "_", "Expression"]},
    {"name": "FunctionExpression$string$1", "symbols": [{"literal":"f"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "FunctionExpression$ebnf$1$subexpression$1", "symbols": ["FormalParameterList", "_"]},
    {"name": "FunctionExpression$ebnf$1", "symbols": ["FunctionExpression$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "FunctionExpression$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "FunctionExpression", "symbols": ["FunctionExpression$string$1", "_", {"literal":"("}, "_", "FunctionExpression$ebnf$1", {"literal":")"}, "_", "Block"]},
    {"name": "FormalParameterList$ebnf$1", "symbols": []},
    {"name": "FormalParameterList$ebnf$1$subexpression$1", "symbols": ["_", {"literal":","}, "_", "Identifier"]},
    {"name": "FormalParameterList$ebnf$1", "symbols": ["FormalParameterList$ebnf$1", "FormalParameterList$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "FormalParameterList", "symbols": ["Identifier", "FormalParameterList$ebnf$1"]},
    {"name": "ChoiceExpression$string$1", "symbols": [{"literal":"c"}, {"literal":"h"}, {"literal":"o"}, {"literal":"i"}, {"literal":"c"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "ChoiceExpression$ebnf$1$subexpression$1$ebnf$1$subexpression$1", "symbols": ["FormalParameterList", "_"]},
    {"name": "ChoiceExpression$ebnf$1$subexpression$1$ebnf$1", "symbols": ["ChoiceExpression$ebnf$1$subexpression$1$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "ChoiceExpression$ebnf$1$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "ChoiceExpression$ebnf$1$subexpression$1", "symbols": [{"literal":"("}, "_", "ChoiceExpression$ebnf$1$subexpression$1$ebnf$1", {"literal":")"}, "_"]},
    {"name": "ChoiceExpression$ebnf$1", "symbols": ["ChoiceExpression$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "ChoiceExpression$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "ChoiceExpression", "symbols": ["ChoiceExpression$string$1", "_", "ChoiceExpression$ebnf$1", {"literal":"{"}, "_", "ChoiceEntries", "_", {"literal":"}"}]},
    {"name": "ChoiceEntries$ebnf$1", "symbols": []},
    {"name": "ChoiceEntries$ebnf$1$subexpression$1", "symbols": ["_", "ChoiceEntry"]},
    {"name": "ChoiceEntries$ebnf$1", "symbols": ["ChoiceEntries$ebnf$1", "ChoiceEntries$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ChoiceEntries", "symbols": ["ChoiceEntry", "ChoiceEntries$ebnf$1"]},
    {"name": "ChoiceEntry", "symbols": ["SpreadExpression"], "postprocess": id},
    {"name": "ChoiceEntry", "symbols": ["TableEntryBody"], "postprocess": id},
    {"name": "TableExpression$string$1", "symbols": [{"literal":"t"}, {"literal":"a"}, {"literal":"b"}, {"literal":"l"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "TableExpression$ebnf$1$subexpression$1$ebnf$1", "symbols": ["FormalParameterList"], "postprocess": id},
    {"name": "TableExpression$ebnf$1$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "TableExpression$ebnf$1$subexpression$1", "symbols": [{"literal":"("}, "TableExpression$ebnf$1$subexpression$1$ebnf$1", {"literal":")"}, "_"]},
    {"name": "TableExpression$ebnf$1", "symbols": ["TableExpression$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "TableExpression$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "TableExpression$ebnf$2", "symbols": []},
    {"name": "TableExpression$ebnf$2", "symbols": ["TableExpression$ebnf$2", "TableEntry"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "TableExpression", "symbols": ["TableExpression$string$1", "_", "TableExpression$ebnf$1", {"literal":"{"}, "_", "TableExpression$ebnf$2", "_", {"literal":"}"}]},
    {"name": "TableEntry", "symbols": ["TableEntrySelector", {"literal":":"}, "_", "TableEntryBody", "_"]},
    {"name": "TableEntrySelector", "symbols": ["NonZeroInteger", {"literal":"-"}, "NonZeroInteger"]},
    {"name": "TableEntrySelector", "symbols": ["NonZeroInteger"]},
    {"name": "TableEntryBody", "symbols": ["Expression"], "postprocess": id},
    {"name": "TableEntryBody", "symbols": ["Block"], "postprocess": id},
    {"name": "Literal", "symbols": ["DiceLiteral"], "postprocess": id},
    {"name": "Literal", "symbols": ["NumberLiteral"], "postprocess": id},
    {"name": "Literal", "symbols": ["StringLiteral"], "postprocess": id},
    {"name": "Literal", "symbols": ["ArrayLiteral"], "postprocess": id},
    {"name": "Literal", "symbols": ["ObjectLiteral"], "postprocess": id},
    {"name": "Literal", "symbols": ["BooleanLiteral"], "postprocess": id},
    {"name": "Literal", "symbols": ["UndefinedLiteral"], "postprocess": id},
    {"name": "UndefinedLiteral$string$1", "symbols": [{"literal":"u"}, {"literal":"n"}, {"literal":"d"}, {"literal":"e"}, {"literal":"f"}, {"literal":"i"}, {"literal":"n"}, {"literal":"e"}, {"literal":"d"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "UndefinedLiteral", "symbols": ["UndefinedLiteral$string$1"], "postprocess": () => createUndefinedLiteral()},
    {"name": "BooleanLiteral$string$1", "symbols": [{"literal":"t"}, {"literal":"r"}, {"literal":"u"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "BooleanLiteral", "symbols": ["BooleanLiteral$string$1"], "postprocess": () => ({ type: 'boolean', value: true })},
    {"name": "BooleanLiteral$string$2", "symbols": [{"literal":"f"}, {"literal":"a"}, {"literal":"l"}, {"literal":"s"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "BooleanLiteral", "symbols": ["BooleanLiteral$string$2"], "postprocess": () => ({ type: 'boolean', value: false })},
    {"name": "ArrayLiteral$ebnf$1$subexpression$1", "symbols": ["ArrayEntries", "_"]},
    {"name": "ArrayLiteral$ebnf$1", "symbols": ["ArrayLiteral$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "ArrayLiteral$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "ArrayLiteral", "symbols": [{"literal":"["}, "_", "ArrayLiteral$ebnf$1", {"literal":"]"}]},
    {"name": "ArrayEntries", "symbols": ["ArrayEntries", "_", {"literal":","}, "_", "Expression"]},
    {"name": "ArrayEntries", "symbols": ["Expression"], "postprocess": id},
    {"name": "ObjectLiteral$ebnf$1$subexpression$1", "symbols": ["ObjectProperties", "_"]},
    {"name": "ObjectLiteral$ebnf$1", "symbols": ["ObjectLiteral$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "ObjectLiteral$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "ObjectLiteral", "symbols": [{"literal":"{"}, "_", "ObjectLiteral$ebnf$1", {"literal":"}"}]},
    {"name": "ObjectProperties", "symbols": ["ObjectProperties", "_", {"literal":","}, "_", "ObjectProperty"]},
    {"name": "ObjectProperties", "symbols": ["ObjectProperty"], "postprocess": id},
    {"name": "ObjectProperty", "symbols": ["StringLiteral", "_", {"literal":":"}, "_", "Expression"]},
    {"name": "ObjectProperty", "symbols": ["Identifier", "_", {"literal":":"}, "_", "Expression"]},
    {"name": "ObjectProperty", "symbols": ["SpreadExpression"]},
    {"name": "DiceLiteral$ebnf$1", "symbols": ["NonZeroInteger"], "postprocess": id},
    {"name": "DiceLiteral$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "DiceLiteral$subexpression$1", "symbols": [/[dD]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "DiceLiteral$ebnf$2", "symbols": ["DiceLiteralSuffix"], "postprocess": id},
    {"name": "DiceLiteral$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "DiceLiteral", "symbols": ["DiceLiteral$ebnf$1", "DiceLiteral$subexpression$1", "NonZeroInteger", "DiceLiteral$ebnf$2"]},
    {"name": "DiceLiteralSuffix$ebnf$1", "symbols": ["NonZeroInteger"], "postprocess": id},
    {"name": "DiceLiteralSuffix$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "DiceLiteralSuffix", "symbols": [/[+-]/, /[lLhH]/, "DiceLiteralSuffix$ebnf$1"]},
    {"name": "LineTerminator", "symbols": [{"literal":"\n"}]},
    {"name": "LineTerminator$string$1", "symbols": [{"literal":"\r"}, {"literal":"\n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "LineTerminator", "symbols": ["LineTerminator$string$1"]},
    {"name": "LineTerminator", "symbols": [{"literal":"\r"}]},
    {"name": "Comment$ebnf$1", "symbols": []},
    {"name": "Comment$ebnf$1", "symbols": ["Comment$ebnf$1", /[^\n(\r\n)\r]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Comment", "symbols": [{"literal":"#"}, "Comment$ebnf$1"]},
    {"name": "NumberLiteral", "symbols": ["Float"], "postprocess": id},
    {"name": "NumberLiteral", "symbols": ["Integer"], "postprocess": id},
    {"name": "Float$string$1", "symbols": [{"literal":"0"}, {"literal":"."}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Float$ebnf$1", "symbols": []},
    {"name": "Float$ebnf$1", "symbols": ["Float$ebnf$1", "DecimalDigit"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Float", "symbols": ["Float$string$1", "Float$ebnf$1"]},
    {"name": "Float$ebnf$2", "symbols": ["DecimalDigit"]},
    {"name": "Float$ebnf$2", "symbols": ["Float$ebnf$2", "DecimalDigit"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Float", "symbols": ["NonZeroInteger", {"literal":"."}, "Float$ebnf$2"]},
    {"name": "Integer", "symbols": [{"literal":"0"}], "postprocess": () => 0},
    {"name": "Integer", "symbols": ["NonZeroInteger"], "postprocess": id},
    {"name": "NonZeroInteger$ebnf$1", "symbols": ["DecimalDigit"]},
    {"name": "NonZeroInteger$ebnf$1", "symbols": ["NonZeroInteger$ebnf$1", "DecimalDigit"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "NonZeroInteger", "symbols": ["NonZeroDigit", "NonZeroInteger$ebnf$1"], "postprocess": ([head, tail]) => parseInt(`${head}${tail.join('')}`, 10)},
    {"name": "NonZeroDigit", "symbols": [/[1-9]/], "postprocess": id},
    {"name": "DecimalDigit", "symbols": [/[0-9]/], "postprocess": id},
    {"name": "Identifier", "symbols": ["IdentifierName"], "postprocess": 
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
        },
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
