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
  = __ body:Expressions? __ {
    return createCompoundExpression(createLocation(location(), options), optionalList(body));
  }

Expressions
  = head:Expression tail:(__ Expression)* {
    return buildList(head, tail, 1);
  }

Block "block"
  = '{' __ body:(Expressions __)? '}' {
    return createBlockExpression(createLocation(location(), options), optionalList(extractOptional(body, 0)));
  }

Expression "expression"
  = Block
  / e:AssignmentExpression __ {
    return e;
  }

AssignmentExpression "assignment"
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

ConditionalExpression "conditional"
  = test:LogicalOrExpression __ '?' __ consequent:Expression __ ':' __ alternate:Expression {
    return createConditionalExpression(createLocation(location(), options), test, consequent, alternate);
  }
  / LogicalOrExpression

LogicalOrExpression "logical or expression"
  = head:LogicalAndExpression tail:(__ OrToken __ LogicalAndExpression)* {
    return composeBinaryExpression(createLocation(location(), options), head, tail);
  }

LogicalAndExpression "logical and expression"
  = head:EqualityExpression tail:(__ AndToken __ EqualityExpression)* {
    return composeBinaryExpression(createLocation(location(), options), head, tail);
  }

EqualityExpression "equality expression"
  = head:RelationalExpression tail:(__ EqualityOperator __ RelationalExpression)* {
    return composeBinaryExpression(createLocation(location(), options), head, tail);
  }

EqualityOperator "equality operator"
  = '=='
  / '!='

RelationalExpression "relational expression"
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

UnaryExpression "unary expression"
  = LeftHandSideExpression
  / operator:UnaryOperator __ argument:UnaryExpression {
    return createUnaryExpression(createLocation(location(), options), operator, argument);
  }

UnaryOperator "unary operator"
  = $('+' !'=')
  / $('-' !'=')
  / NotToken

LeftHandSideExpression "left-hand side"
  = CallExpression
  / MemberExpression

CallExpression "call expression"
  = head:(
    callee:MemberExpression __ args:Arguments {
      return createCallExpression(createLocation(location(), options), callee, args);
    }
  )
  tail:(
    __ args:Arguments {
      return { type: 'call', args }
    }
    / '[' __ property:Expression __ ']' {
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

Arguments "arguments"
  = '(' __ args:(ArgumentList __)? ')' {
    return args ? args[0] : [];
  }

ArgumentList
  = head:AssignmentExpression tail:(__ Comma __ AssignmentExpression)* {
    return composeList(head, extractList(tail, 3));
  }

MemberExpression "member expression"
  = head:(
    PrimaryExpression
  )
  tail:(
    '[' __ property:Expression __ ']' {
      return { property };
    }
    / '.' __ property:Identifier {
      return { property: createStringLiteral(property) };
    }
  )* {
    return tail.reduce((result, element) => createObjectPropertyExpression(createLocation(location(), options), result, element.property), head);
  }

FunctionExpression "function expression"
  = FunctionToken __ '(' __ params:(FormalParameterList __)? ')' __ body:Block {
    return createFunctionExpression(createLocation(location(), options), params ? params[0] : [], body);
  }

FormalParameterList "formal parameter list"
  = head:Identifier tail:(__ Comma __ Identifier)* {
    return composeList(head, extractList(tail, 3));
  }

ChoiceExpression "choice expression"
  = ChoiceToken __ '(' __ params:(FormalParameterList __)? ')' __ '{' __ entries:ChoiceEntries __ '}' {
    return createTableExpression(createLocation(location(), options), params ? params[0] : [], entries);
  }
  / ChoiceToken __ '{' __ entries:ChoiceEntries __ '}' {
    return createTableExpression(createLocation(location(), options), [], entries);
  }

ChoiceEntries "table entries"
  = head:SimpleTableEntry tail:(__ SimpleTableEntry)* {
    return composeList(head, extractList(tail, 1));
  }

TableExpression "table expression"
  = TableToken __ '(' __ params:(FormalParameterList __)? ')' __ '{' __ entries:TableEntries __ '}' {
    return createTableExpression(createLocation(location(), options), params ? params[0] : [], entries);
  }
  / TableToken __ '{' __ entries:TableEntries __ '}' {
    return createTableExpression(createLocation(location(), options), [], entries);
  }

TableEntries "table entries"
  = head:TableEntry tail:(__ TableEntry)* {
    return composeList(head, extractList(tail, 1));
  }

TableEntry "table entry"
  = selector:TableEntrySelector ':' __ body:TableEntryBody {
    return createTableEntryExpression(selector, body);
  }

TableEntrySelector "table entry selector"
  = start:NonZeroInteger '-' end:NonZeroInteger {
    return createRangeTableSelector(start, end);
  }
  / roll:NonZeroInteger {
    return createExactTableSelector(roll);
  }

SimpleTableEntry "simple table entry"
  = spread:SpreadExpression {
    return createSpreadTableEntryExpression(spread);
  }
  / body:TableEntryBody {
    return createSimpleTableEntryExpression(body);
  }

TableEntryBody "table entry body"
  = Expression
  / Block

IfExpression "if expression"
  = IfToken __ '(' __ e:Expression __ ')' __ ifBlock:Expression __ ElseToken __ elseBlock:Expression {
    return createIfExpression(createLocation(location(), options), e, ifBlock, elseBlock);
  }
  / IfToken __ '(' __ e:Expression __ ')' __ ifBlock:Expression {
    return createIfExpression(createLocation(location(), options), e, ifBlock);
  }

SpreadExpression "spread"
  = '...' e:Expression {
    return createSpreadExpression(createLocation(location(), options), e);
  }

PrimaryExpression
  = Literal
  / i:Identifier __ {
    return createVariableExpression(i);
  }
  / FunctionExpression
  / ChoiceExpression
  / TableExpression
  / '(' __ e:AdditiveExpression __ ')' {
    return e;
  }
  / IfExpression
  / SpreadExpression

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

ArrayLiteral "array"
  = '[' __ e:ArrayEntries __ ']' {
    return createArrayLiteral(createLocation(location(), options), e);
  }
  / '[' __ ']' {
    return createArrayLiteral(createLocation(location(), options), []);
  }

ArrayEntries
  = head:Expression tail:(__ Comma __ Expression)* {
    return composeList(head, extractList(tail, 3));
  }
  / e:Expression {
    return [e];
  }

ObjectLiteral "object"
  = '{' __ p:ObjectProperties __ '}' {
    return createObjectLiteral(createLocation(location(), options), p);
  }
  / '{' __ '}' {
    return createObjectLiteral(createLocation(location(), options), []);
  }

ObjectProperties
  = head:ObjectProperty __ Comma __ tail:ObjectProperties {
    return composeList(head, tail);
  }
  / p:ObjectProperty {
    return [p];
  }

Comma ","
  = ','

ObjectProperty
  = key:String __ ':' __ value:Expression {
    return createObjectLiteralPropertyExpression(key, value);
  }
  / key:Identifier __ ':' __ value:Expression {
    return createObjectLiteralPropertyExpression(key, value);
  }
  / SpreadExpression

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
AndToken = $("and" !IdentifierPart)
OrToken = $("or" !IdentifierPart)
NotToken = "not" !IdentifierPart { return 'not'; }
FunctionToken = "fn" !IdentifierPart
ChoiceToken = "choice" !IdentifierPart
TableToken = "table" !IdentifierPart
UndefinedToken = "undefined" !IdentifierPart
