// Copyright 2017 Jamie Hale
//
// This file is part of Tablescript.js.
//
// Tablescript.js is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Tablescript.js is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Tablescript.js. If not, see <http://www.gnu.org/licenses/>.

{
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
}

Start
  = __ body:ExpressionList? __ {
    return createCompoundExpression(createLocation(location(), options), optionalList(body));
  }

ExpressionList
  = head:Expression __ tail:ExpressionList {
    return composeList(head, tail);
  }
  / e:Expression {
    return [e];
  }

Block
  = '{' __ body:(ExpressionList __)? '}' {
    return createBlockExpression(createLocation(location(), options), optionalList(extractOptional(body, 0)));
  }

Expression
  = e:AssignmentExpression __ ';' {
    return e;
  }

AssignmentExpression
  = l:LeftHandSideExpression __ o:AssignmentOperator __ e:ConditionalExpression {
    return createAssignmentExpression(createLocation(location(), options), l, o, e);
  }
  / ConditionalExpression

AssignmentOperator "assignment operator"
  = '=' !'=' { return '='; }
  / '=' !'>' { return '='; }
  / '+='
  / '-='
  / '*='
  / '/='
  / '%='

ConditionalExpression
  = test:LogicalOrExpression __ '?' __ consequent:AssignmentExpression __ ':' __ alternate:AssignmentExpression {
    return createConditionalExpression(createLocation(location(), options), test, consequent, alternate);
  }
  / LogicalOrExpression

LogicalOrExpression
  = head:LogicalAndExpression tail:(__ OrToken __ LogicalAndExpression)* {
    return composeBinaryExpression(createLocation(location(), options), head, tail);
  }

LogicalAndExpression
  = head:EqualityExpression tail:(__ AndToken __ EqualityExpression)* {
    return composeBinaryExpression(createLocation(location(), options), head, tail);
  }

EqualityExpression
  = head:RelationalExpression tail:(__ EqualityOperator __ RelationalExpression)* {
    return composeBinaryExpression(createLocation(location(), options), head, tail);
  }

EqualityOperator "equality operator"
  = '=='
  / '!='

RelationalExpression
  = head:AdditiveExpression tail:(__ RelationalOperator __ AdditiveExpression)* {
    return composeBinaryExpression(createLocation(location(), options), head, tail);
  }

RelationalOperator "relational operator"
  = '<='
  / '>='
  / '<'
  / '>'

AdditiveExpression
  = head:MultiplicativeExpression tail:(__ AdditiveOperator __ MultiplicativeExpression)* {
    return composeBinaryExpression(createLocation(location(), options), head, tail);
  }

AdditiveOperator "addition or subtraction operator"
  = $('+' !'=')
  / $('-' !'=')

MultiplicativeExpression
  = head:UnaryExpression tail:(__ MultiplicativeOperator __ UnaryExpression)* {
    return composeBinaryExpression(createLocation(location(), options), head, tail);
  }

MultiplicativeOperator "multiply, divide, or modulo operator"
  = $('*' !'=')
  / $('/' !'=')
  / $('%' !'=')

UnaryExpression
  = LeftHandSideExpression
  / operator:UnaryOperator __ argument:UnaryExpression {
    return createUnaryExpression(createLocation(location(), options), operator, argument);
  }

UnaryOperator "unary operator"
  = $('+' !'=')
  / $('-' !'=')
  / NotToken

LeftHandSideExpression
  = CallExpression
  / MemberExpression

CallExpression
  = head:(
    callee:MemberExpression __ args:Arguments {
      return createCallExpression(createLocation(location(), options), callee, args);
    }
  )
  tail:(
    __ args:Arguments {
      return { type: 'call', args }
    }
    / '[' __ property:AssignmentExpression __ ']' {
      return { 'type': 'member', property };
    }
    / '.' __ property:Identifier {
      return { 'type': 'member', property: createStringLiteral(property) };
    }
  )* {
    return tail.reduce((result, element) => {
      if (element.type === 'call') {
        return createCallExpression(createLocation(location(), options), result, element.args);
      } else {
        return createObjectPropertyExpression(createLocation(location(), options), result, element.property);
      }
    }, head);
  }

Arguments
  = '(' __ args:ArgumentList __ ')' {
    return args;
  }
  / '(' __ ')' {
    return [];
  }

ArgumentList
  = head:Argument __ ',' __ tail:ArgumentList {
    return composeList(head, tail);
  }
  / e:Argument {
    return [e];
  }

Argument
  = AssignmentExpression
  / "..." e:AssignmentExpression {
    return createSpreadExpression(createLocation(location(), options), e);
  }

MemberExpression
  = head:(
    PrimaryExpression
  )
  tail:(
    '[' __ property:AssignmentExpression __ ']' {
      return { property };
    }
    / '.' __ property:Identifier {
      return { property: createStringLiteral(property) };
    }
  )* {
    return tail.reduce((result, element) => createObjectPropertyExpression(createLocation(location(), options), result, element.property), head);
  }

FunctionExpression
  = FunctionToken __ '(' __ params:FormalParameterList __ ')' __ body:FunctionBody {
    return createFunctionExpression(createLocation(location(), options), params, body);
  }
  / FunctionToken __ '(' __ ')' __ body:FunctionBody {
    return createFunctionExpression(createLocation(location(), options), [], body);
  }

FormalParameterList "formal parameter list"
  = head:Identifier __ ',' __ tail:FormalParameterList {
    return composeList(head, tail);
  }
  / i:Identifier {
    return [i];
  }

FunctionBody
  = '{' __ list:ExpressionList __ '}' {
    return createBlockExpression(createLocation(location(), options), list);
  }
  / '{' __ '}' {
    return createBlockExpression(createLocation(location(), options), []);
  }
  / e:AssignmentExpression {
    return createBlockExpression(createLocation(location(), options), [e]);
  }

ChoiceExpression
  = ChoiceToken __ '(' __ params:(FormalParameterList __)? ')' __ '{' __ entries:ChoiceEntries __ '}' {
    return createTableExpression(createLocation(location(), options), params ? params[0] : [], entries);
  }
  / ChoiceToken __ '{' __ entries:ChoiceEntries __ '}' {
    return createTableExpression(createLocation(location(), options), [], entries);
  }

ChoiceEntries
  = head:ChoiceEntry __ tail:ChoiceEntries {
    return composeList(head, tail);
  }
  / e:ChoiceEntry {
    return [e];
  }

ChoiceEntry
  = "..." e:AssignmentExpression {
    return createSpreadTableEntryExpression(createSpreadExpression(createLocation(location(), options), e));
  }
  / '{' __ list:ExpressionList __ '}' {
    return createSimpleTableEntryExpression(createBlockExpression(createLocation(location(), options), list));
  }
  / s:StringLiteral {
    return createSimpleTableEntryExpression(s);
  }

TableExpression
  = TableToken __ '(' __ params:(FormalParameterList __)? ')' __ '{' __ entries:TableEntries __ '}' {
    return createTableExpression(createLocation(location(), options), params ? params[0] : [], entries);
  }
  / TableToken __ '{' __ entries:TableEntries __ '}' {
    return createTableExpression(createLocation(location(), options), [], entries);
  }

TableEntries
  = head:TableEntry __ tail:TableEntries {
    return composeList(head, tail);
  }
  / e:TableEntry {
    return [e];
  }

TableEntry
  = selector:TableEntrySelector ':' __ body:TableEntryBody {
    return createTableEntryExpression(selector, body);
  }

TableEntrySelector
  = start:NonZeroInteger '-' end:NonZeroInteger {
    return createRangeTableSelector(start, end);
  }
  / roll:NonZeroInteger {
    return createExactTableSelector(roll);
  }

TableEntryBody
  = '{' __ list:ExpressionList __ '}' {
    return createBlockExpression(createLocation(location(), options), list);
  }
  / StringLiteral

IfExpression
  = IfToken __ '(' __ e:AssignmentExpression __ ')' __ ifBlock:IfBlock __ ElseToken __ elseBlock:IfBlock {
    return createIfExpression(createLocation(location(), options), e, ifBlock, elseBlock);
  }
  / IfToken __ '(' __ e:AssignmentExpression __ ')' __ ifBlock:IfBlock {
    return createIfExpression(createLocation(location(), options), e, ifBlock);
  }

IfBlock
  = '{' __ list:ExpressionList __ '}' {
    return createBlockExpression(createLocation(location(), options), list);
  }
  / '{' __ '}' {
    return createBlockExpression(createLocation(location(), options), []);
  }
  / e:AssignmentExpression {
    return createBlockExpression(createLocation(location(), options), [e]);
  }

WhileExpression
  = WhileToken __ '(' __ e:AssignmentExpression __ ')' __ loopBlock:LoopBlock {
    return createWhileExpression(createLocation(location(), options), e, loopBlock);
  }

UntilExpression
  = UntilToken __ '(' __ e:AssignmentExpression __ ')' __ loopBlock:LoopBlock {
    return createUntilExpression(createLocation(location(), options), e, loopBlock);
  }

LoopBlock
  = '{' __ list:ExpressionList __ '}' {
    return createBlockExpression(createLocation(location(), options), list);
  }
  / '{' __ '}' {
    return createBlockExpression(createLocation(location(), options), []);
  }
  / e:AssignmentExpression {
    return createBlockExpression(createLocation(location(), options), [e]);
  }

PrimaryExpression
  = Literal
  / i:Identifier __ {
    return createVariableExpression(i);
  }
  / FunctionExpression
  / ChoiceExpression
  / TableExpression
  / '(' __ e:AssignmentExpression __ ')' {
    return e;
  }
  / IfExpression
  / WhileExpression
  / UntilExpression

Literal
  = DiceLiteral
  / IntegerLiteral
  / StringLiteral
  / ArrayLiteral
  / ObjectLiteral
  / BooleanLiteral
  / UndefinedLiteral

UndefinedLiteral "undefined"
  = UndefinedToken {
    return createUndefinedLiteral();
  }

BooleanLiteral "boolean"
  = TrueToken {
    return createBooleanLiteral(true);
  }
  / FalseToken {
    return createBooleanLiteral(false);
  }

ArrayLiteral
  = '[' __ e:ArrayEntries __ ']' {
    return createArrayLiteral(createLocation(location(), options), e);
  }
  / '[' __ ']' {
    return createArrayLiteral(createLocation(location(), options), []);
  }

ArrayEntries
  = head:ArrayEntry __ ',' __ tail:ArrayEntries {
    return composeList(head, tail);
  }
  / e:ArrayEntry {
    return [e];
  }

ArrayEntry
  = AssignmentExpression
  / "..." e:AssignmentExpression {
    return createSpreadExpression(createLocation(location(), options), e);
  }

ObjectLiteral "object"
  = '{' __ p:ObjectProperties __ '}' {
    return createObjectLiteral(createLocation(location(), options), p);
  }
  / '{' __ '}' {
    return createObjectLiteral(createLocation(location(), options), []);
  }

ObjectProperties
  = head:ObjectProperty __ ',' __ tail:ObjectProperties {
    return composeList(head, tail);
  }
  / p:ObjectProperty {
    return [p];
  }

Comma ","
  = ','

ObjectProperty
  = key:String __ ':' __ value:AssignmentExpression {
    return createObjectLiteralPropertyExpression(key, value);
  }
  / key:Identifier __ ':' __ value:AssignmentExpression {
    return createObjectLiteralPropertyExpression(key, value);
  }
  / key:Identifier {
    return createObjectLiteralPropertyExpression(key, createVariableExpression(key));
  }
  / "..." e:AssignmentExpression {
    return createSpreadExpression(createLocation(location(), options), e);
  }

DiceLiteral "dice"
  = count:NonZeroInteger ('d' / 'D') die:NonZeroInteger suffix:DiceLiteralSuffix? {
    return createDiceLiteral(count, die, suffix);
  }
  / ('d' / 'D') die:NonZeroInteger suffix:DiceLiteralSuffix? {
    return createDiceLiteral(1, die, suffix);
  }

DiceLiteralSuffix
  = operator:DiceLiteralSuffixOperator specifier:DiceLiteralSuffixSpecifier count:NonZeroInteger? {
    return createDiceLiteralSuffix(operator, specifier.toLowerCase(), count);
  }

DiceLiteralSuffixOperator
  = '-'
  / '+'

DiceLiteralSuffixSpecifier
  = 'l'
  / 'L'
  / 'h'
  / 'H'

LineTerminator "end of line"
  = "\n"
  / "\r\n"
  / "\r"

Whitespace "whitespace"
  = [ \t\n\r]

Comment "comment"
  = '#' (!LineTerminator .)*
  
__
  = (Whitespace / Comment)*

IntegerLiteral "integer"
  = f:Float {
    return createNumberLiteral(f);
  }
  / i:Integer {
    return createNumberLiteral(i);
  }

Float
  = "0." DecimalDigit* {
    return parseFloat(text());
  }
  / NonZeroDigit DecimalDigit* "." DecimalDigit+ {
    return parseFloat(text());
  }

Integer
  = "0" {
    return 0;
  }
  / i:NonZeroInteger {
    return parseInt(text());
  }

NonZeroInteger
  = NonZeroDigit DecimalDigit* {
    return parseInt(text());
  }

NonZeroDigit
  = [1-9]

DecimalDigit
  = [0-9]

Identifier "identifier"
  = !ReservedWord head:IdentifierStart tail:IdentifierPart* {
    return head + tail.join('');
  }

IdentifierStart
  = [_a-zA-Z]

IdentifierPart
  = IdentifierStart
  / [0-9]

StringLiteral "string"
  = s:String {
    return createStringLiteral(s);
  }
  / '"' s:DoubleQuoteStringCharacter* '"' {
    return createTemplateStringLiteral(s.join(''));
  }

String
  = "'" s:SingleQuoteStringCharacter* "'" {
    return s.join('');
  }

DoubleQuoteStringCharacter
  = '\\\"' {
    return '"';
  }
  / !('"') . {
    return text();
  }

SingleQuoteStringCharacter
  = "\\\'" {
    return "'";
  }
  / !("'") . {
    return text();
  }

ReservedWord
  = TrueToken
  / FalseToken
  / IfToken
  / ElseToken
  / WhileToken
  / UntilToken
  / AndToken
  / OrToken
  / NotToken
  / FunctionToken
  / ChoiceToken
  / TableToken
  / UndefinedToken

TrueToken = "true" !IdentifierPart
FalseToken = "false" !IdentifierPart
IfToken = "if" !IdentifierPart
ElseToken = "else" !IdentifierPart
WhileToken = "while" !IdentifierPart
UntilToken = "until" !IdentifierPart
AndToken = $("and" !IdentifierPart)
OrToken = $("or" !IdentifierPart)
NotToken = "not" !IdentifierPart { return 'not'; }
FunctionToken = "fn" !IdentifierPart
ChoiceToken = "choice" !IdentifierPart
TableToken = "table" !IdentifierPart
UndefinedToken = "undefined" !IdentifierPart
