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
  const {
    createBlock,
    createExpressionStatement,
  } = require('./statements');

  const {
    createAssignmentExpression,
    createConditionalExpression,
    createBinaryExpression,
    createUnaryExpression,
    createCallExpression,
    createObjectPropertyExpression,
    createPlusEqualsExpression,
    createFunctionExpression,
    createTableExpression,
    createTableEntry,
    createNextTableEntry,
    createRangeTableSelector,
    createExactTableSelector,
    createVariableExpression,
    createBooleanLiteral,
    createArrayLiteral,
    createObjectLiteral,
    createObjectLiteralPropertyExpression,
    createDiceLiteral,
    createNumberLiteral,
    createStringLiteral,
    createIfExpression,
    createSpreadExpression,
  } = require('./expressions');

  const composeBinaryExpression = (context, head, tail) => {
    return tail.reduce((result, element) => createBinaryExpression(context, result, element[1], element[3]), head);
  };

  const optionalList = (list) => list ? list : [];
  const extractOptional = (optional, index) => optional ? optional[index] : null;
  const extractList = (list, index) => list.map(e => e[index]);
  const composeList = (head, tail) => [head, ...tail];
  const buildList = (head, tail, index) => [head, ...extractList(tail, index)];

  const createContext = (location, options) => ({
    path: options.path,
    line: location.start.line,
    column: location.start.column,
  });
}

Start
  = __ p:Program __ {
    return p;
  }

Program
  = body:Statements? {
    return optionalList(body);
  }

Statements
  = head:Statement tail:(__ Statement)* {
    return buildList(head, tail, 1);
  }

Statement
  = Block
  / ExpressionStatement

Block
  = '{' __ body:(Statements __)? '}' {
    return createBlock(optionalList(extractOptional(body, 0)));
  }

ExpressionStatement
  = e:Expression {
    return createExpressionStatement(e);
  }

Expression
  = e:AssignmentExpression __ {
    return e;
  }

AssignmentExpression
  = l:LeftHandSideExpression __ '=' __ e:Expression {
    return createAssignmentExpression(createContext(location(), options), l, e);
  }
  / l:LeftHandSideExpression __ '+=' __ e:Expression {
    return createPlusEqualsExpression(createContext(location(), options), l, e);
  }
  / ConditionalExpression

ConditionalExpression
  = test:LogicalOrExpression __ '?' __ consequent:Expression __ ':' __ alternate:Expression {
    return createConditionalExpression(createContext(location(), options), test, consequent, alternate);
  }
  / LogicalOrExpression

LogicalOrExpression
  = head:LogicalAndExpression tail:(__ 'or' __ LogicalAndExpression)* {
    return composeBinaryExpression(createContext(location(), options), head, tail);
  }

LogicalAndExpression
  = head:EqualityExpression tail:(__ 'and' __ EqualityExpression)* {
    return composeBinaryExpression(createContext(location(), options), head, tail);
  }

EqualityExpression
  = head:RelationalExpression tail:(__ EqualityOperator __ RelationalExpression)* {
    return composeBinaryExpression(createContext(location(), options), head, tail);
  }

EqualityOperator
  = '=='
  / '!='

RelationalExpression
  = head:AdditiveExpression tail:(__ RelationalOperator __ AdditiveExpression)* {
    return composeBinaryExpression(createContext(location(), options), head, tail);
  }

RelationalOperator
  = '<='
  / '>='
  / '<'
  / '>'

AdditiveExpression
  = head:MultiplicativeExpression tail:(__ AdditiveOperator __ MultiplicativeExpression)* {
    return composeBinaryExpression(createContext(location(), options), head, tail);
  }

AdditiveOperator
  = '+'
  / '-'

MultiplicativeExpression
  = head:UnaryExpression tail:(__ MultiplicativeOperator __ UnaryExpression)* {
    return composeBinaryExpression(createContext(location(), options), head, tail);
  }

MultiplicativeOperator
  = '*'
  / '/'
  / '%'

UnaryExpression
  = LeftHandSideExpression
  / operator:UnaryOperator __ argument:UnaryExpression {
    return createUnaryExpression(createContext(location(), options), operator, argument);
  }

UnaryOperator
  = '+'
  / '-'
  / 'not'

LeftHandSideExpression
  = CallExpression
  / MemberExpression

CallExpression
  = head:(
    callee:MemberExpression __ args:Arguments {
      return createCallExpression(createContext(location(), options), callee, args);
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
      return { 'type': 'member', property: createStringLiteral(createContext(location(), options), property) };
    }
  )* {
    return tail.reduce((result, element) => {
      if (element.type === 'call') {
        return createCallExpression(createContext(location(), options), result, element.args);
      } else {
        return createObjectPropertyExpression(createContext(location(), options), result, element.property);
      }
    }, head);
  }

Arguments
  = '(' __ args:(ArgumentList __)? ')' {
    return args ? args[0] : [];
  }

ArgumentList
  = head:AssignmentExpression tail:(__ ',' __ AssignmentExpression)* {
    return composeList(head, extractList(tail, 3));
  }

MemberExpression
  = head:(
    PrimaryExpression
  )
  tail:(
    __ '[' __ property:Expression __ ']' {
      return { property };
    }
    / __ '.' __ property:Identifier {
      return { property: createStringLiteral(createContext(location(), options), property) };
    }
  )* {
    return tail.reduce((result, element) => createObjectPropertyExpression(createContext(location(), options), result, element.property), head);
  }

FunctionExpression
  = '(' __ params:(FormalParameterList __)? ')' __ '=>' __ '{' __ body:FunctionBody __ '}' {
    return createFunctionExpression(createContext(location(), options), params ? params[0] : [], body);
  }

FormalParameterList
  = head:Identifier tail:(__ ',' __ Identifier)* {
    return composeList(head, extractList(tail, 3));
  }

FunctionBody
  = body:Statements? {
    return createBlock(optionalList(body));
  }

TableExpression
  = 'table' __ '(' __ params:(FormalParameterList __)? ')' __ '{' __ entries:TableEntries __ '}' {
    return createTableExpression(createContext(location(), options), params ? params[0] : [], entries);
  }
  / 'table' __ '{' __ entries:TableEntries __ '}' {
    return createTableExpression(createContext(location(), options), [], entries);
  }

TableEntries
  = head:TableEntry tail:(__ TableEntry)* {
    return composeList(head, extractList(tail, 1));
  }

TableEntry
  = selector:TableEntrySelector __ ':' __ body:TableEntryBody {
    return createTableEntry(selector, body);
  }
  / body:TableEntryBody {
    return createNextTableEntry(body);
  }

TableEntrySelector
  = start:Integer __ '-' __ end:Integer {
    return createRangeTableSelector(start, end);
  }
  / roll:Integer {
    return createExactTableSelector(roll);
  }

TableEntryBody
  = Expression
  / Block

IfExpression
  = 'if' __ '(' __ e:Expression __ ')' __ ifBlock:Statement __ 'else' __ elseBlock:Statement {
    return createIfExpression(createContext(location(), options), e, ifBlock, elseBlock);
  }
  / 'if' __ '(' __ e:Expression __ ')' __ ifBlock:Statement {
    return createIfExpression(createContext(location(), options), e, ifBlock);
  }

SpreadExpression
  = '...' e:Expression {
    return createSpreadExpression(createContext(location(), options), e);
  }

PrimaryExpression
  = Literal
  / i:Identifier __ {
    return createVariableExpression(createContext(location(), options), i);
  }
  / FunctionExpression
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

BooleanLiteral
  = 'true' {
    return createBooleanLiteral(createContext(location(), options), true);
  }
  / 'false' {
    return createBooleanLiteral(createContext(location(), options), false);
  }

ArrayLiteral
  = '[' __ e:ArrayEntries __ ']' {
    return createArrayLiteral(createContext(location(), options), e);
  }
  / '[' __ ']' {
    return createArrayLiteral(createContext(location(), options), []);
  }

ArrayEntries
  = head:Expression tail:(__ ',' __ Expression)* {
    return composeList(head, extractList(tail, 3));
  }
  / e:Expression {
    return [e];
  }

ObjectLiteral
  = '{' __ p:ObjectProperties __ '}' {
    return createObjectLiteral(createContext(location(), options), p);
  }
  / '{' __ '}' {
    return createObjectLiteral(createContext(location(), options), []);
  }

ObjectProperties
  = head:ObjectProperty __ ',' __ tail:ObjectProperties {
    return composeList(head, tail);
  }
  / p:ObjectProperty {
    return [p];
  }

ObjectProperty
  = key:String __ ':' __ value:Expression {
    return createObjectLiteralPropertyExpression(createContext(location(), options), key, value);
  }
  / key:Identifier __ ':' __ value:Expression {
    return createObjectLiteralPropertyExpression(createContext(location(), options), key, value);
  }
  / SpreadExpression

DiceLiteral
  = count:NonZeroInteger 'd' die:NonZeroInteger {
    return createDiceLiteral(createContext(location(), options), count, die);
  }
  / 'd' die:NonZeroInteger {
    return createDiceLiteral(createContext(location(), options), 1, die);
  }

LineTerminator
  = "\n"
  / "\r\n"
  / "\r"

Whitespace
  = [ \t\n\r]

Comment
  = '#' (!LineTerminator .)*
  
__
  = (Whitespace / Comment)*

IntegerLiteral
  = i:Integer {
    return createNumberLiteral(createContext(location(), options), i);
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

Identifier
  = !ReservedWord head:IdentifierStart tail:IdentifierPart* {
    return head + tail.join('');
  }

IdentifierStart
  = [_a-zA-Z]

IdentifierPart
  = IdentifierStart
  / [0-9]

StringLiteral
  = s:String {
    return createStringLiteral(createContext(location(), options), s);
  }

String
  = '"' s:DoubleQuoteStringCharacter* '"' {
    return s.join('');
  }
  / "'" s:SingleQuoteStringCharacter* "'" {
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
  = 'true' !IdentifierPart
  / 'false' !IdentifierPart
  / 'if' !IdentifierPart
  / 'else' !IdentifierPart
  / 'and' !IdentifierPart
  / 'or' !IdentifierPart
  / 'not' !IdentifierPart
  / 'table' !IdentifierPart
  / 'return' !IdentifierPart