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
  const { createConditionalExpression } = require('../expressions/conditional');
  const { createBinaryExpression } = require('../expressions/binary');
  const { createUnaryExpression } = require('../expressions/unary');
  const { createCallExpression } = require('../expressions/call');
  const { createObjectPropertyExpression } = require('../expressions/object-property');
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
  const { createCompoundStringExpression } = require('../expressions/compound-string');
  const { createUndefinedLiteral } = require('../expressions/undefined-literal');
  const { createSpreadExpression } = require('../expressions/spread');

  const composeBinaryExpression = (context, head, tail) => {
    return tail.reduce((result, element) => createBinaryExpression(context, result, element[1], element[3]), head);
  };

  const extractList = (list, index) => list.map(e => e[index]);
  const composeList = (head, tail) => [head, ...tail];
  const flatten = (list) => list.reduce((acc, e) => ([...acc, ...e]), []);

  const createLocation = (location, options) => ({
    path: options.path,
    line: location.start.line,
    column: location.start.column,
  });
}

Start
  = head:RawText tail:(TemplateString RawText)* {
    return createCompoundStringExpression([head, ...flatten(tail)]);
  }

RawText
  = RawChar* {
    return createStringLiteral(text());
  }

RawChar
  = !("#{") . {
    return text();
  }

TemplateString
  = '#{' __ e:Expression __ '}' {
    return e;
  }

Expression "expression"
  = e:ConditionalExpression __ {
    return e;
  }

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
    / __ '[' __ property:Expression __ ']' {
      return { 'type': 'member', property };
    }
    / __ '.' __ property:Identifier {
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
  = head:Expression tail:(__ Comma __ Expression)* {
    return composeList(head, extractList(tail, 3));
  }

MemberExpression "member expression"
  = head:(
    PrimaryExpression
  )
  tail:(
    __ '[' __ property:Expression __ ']' {
      return { property };
    }
    / __ '.' __ property:Identifier {
      return { property: createStringLiteral(property) };
    }
  )* {
    return tail.reduce((result, element) => createObjectPropertyExpression(createLocation(location(), options), result, element.property), head);
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
  / '(' __ e:AdditiveExpression __ ')' {
    return e;
  }
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
    return createObjectLiteral(p);
  }
  / '{' __ '}' {
    return createObjectLiteral([]);
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

Whitespace "whitespace"
  = [ \t\n\r]

__
  = Whitespace*

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

String
  = "'" s:SingleQuoteStringCharacter* "'" {
    return s.join('');
  }
  / '"' s:DoubleQuoteStringCharacter* '"' {
    return s.join('');
  }

DoubleQuoteStringCharacter
  = !('"') . {
    return text();
  }

SingleQuoteStringCharacter
  = !("'") . {
    return text();
  }

ReservedWord
  = TrueToken
  / FalseToken
  / AndToken
  / OrToken
  / NotToken
  / UndefinedToken

TrueToken = "true" !IdentifierPart
FalseToken = "false" !IdentifierPart
AndToken = $("and" !IdentifierPart)
OrToken = $("or" !IdentifierPart)
NotToken = "not" !IdentifierPart { return 'not'; }
UndefinedToken = "undefined" !IdentifierPart
