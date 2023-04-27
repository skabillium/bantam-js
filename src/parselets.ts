import {
    AssignExpression,
    CallExpression,
    ConditionalExpression,
    Expression,
    NameExpression,
    OperatorExpression,
    PostfixExpression,
    PrefixExpression,
} from './expressions';
import { Parser } from './parser';
import { Precedence } from './precedence';
import { Token, TokenType } from './tokens';

export interface PrefixParselet {
    parse(parser: Parser, token: Token): Expression;
}

export interface InfixParselet {
    parse(parser: Parser, left: Expression, token: Token): Expression;
    getPrecedence(): number;
}

export class NameParselet implements PrefixParselet {
    parse(parser: Parser, token: Token): Expression {
        return new NameExpression(token.text);
    }
}

// Parselet for "!", "~", "+" & "-"
export class PrefixOperatorParselet implements PrefixParselet {
    constructor(private precedence: number) {}

    parse(parser: Parser, token: Token): Expression {
        // To handle right-associative operators like "^", we allow a slightly
        // lower precedence when parsing the right-hand side. This will let a
        // parselet with the same precedence appear on the right, which will then
        // take *this* parselet's result as its left-hand argument.
        const right: Expression = parser.parseExpression(this.precedence);
        return new PrefixExpression(token.type, right);
    }

    getPrecedence() {
        return this.precedence;
    }
}

// Generic infix parselet for a unary arithmetic operator
// Parses postfix unary "?" expressions
export class PostfixOperatorParselet implements InfixParselet {
    constructor(private precedence: number) {}

    parse(parser: Parser, left: Expression, token: Token): Expression {
        return new PostfixExpression(left, token.type);
    }

    getPrecedence(): number {
        return this.precedence;
    }
}

/**
 * Generic infix parselet for a binary arithmetic operator. The only
 * difference when parsing, "+", "-", "*", "/", and "^" is precedence and
 * associativity, so we can use a single parselet class for all of those.
 */
export class BinaryOperatorParselet implements InfixParselet {
    constructor(private precedence: number, private isRight: boolean) {}

    parse(parser: Parser, left: Expression, token: Token): Expression {
        // To handle right-associative operators like "^", we allow a slightly
        // lower precedence when parsing the right-hand side. This will let a
        // parselet with the same precedence appear on the right, which will then
        // take *this* parselet's result as its left-hand argument.
        const right: Expression = parser.parseExpression(
            this.precedence - (this.isRight ? 1 : 0),
        );

        return new OperatorExpression(left, token.type, right);
    }

    getPrecedence(): number {
        return this.precedence;
    }
}

/*
 * Parses assignment expressions like "a = b". The left side of an assignment
 * expression must be a simple name like "a", and expressions are
 * right-associative. (In other words, "a = b = c" is parsed as "a = (b = c)").
 */
export class AssignParselet implements InfixParselet {
    parse(parser: Parser, left: Expression, token: Token): Expression {
        const right: Expression = parser.parseExpression(
            Precedence.ASSIGNMENT - 1,
        );

        if (!(left instanceof NameExpression)) {
            throw new Error(
                'The left hand side of an assignment must be a name',
            );
        }
        const name: string = left.getName();
        return new AssignExpression(name, right);
    }

    getPrecedence(): number {
        return Precedence.ASSIGNMENT;
    }
}

/**
 * Parselet to parse a function call like "a(b, c, d)".
 */
export class CallParselet implements InfixParselet {
    parse(parser: Parser, left: Expression, token: Token): Expression {
        const args: Expression[] = [];

        // There may be no arguments
        if (!parser.match(TokenType.RIGHT_PAREN)) {
            do {
                args.push(parser.parseExpression());
            } while (parser.match(TokenType.COMMA));

            parser.consumeExpected(TokenType.RIGHT_PAREN);
        }

        return new CallExpression(left, args);
    }

    getPrecedence(): number {
        return Precedence.CALL;
    }
}

export class ConditionalParselet implements InfixParselet {
    parse(parser: Parser, left: Expression, token: Token): Expression {
        const thenArm: Expression = parser.parseExpression();
        parser.consumeExpected(TokenType.COLON);
        const elseArm: Expression = parser.parseExpression(
            Precedence.CONDITIONAL - 1,
        );

        return new ConditionalExpression(left, thenArm, elseArm);
    }

    getPrecedence(): number {
        return Precedence.CONDITIONAL;
    }
}

/**
 * Parses parentheses used to group an expression, like "a * (b + c)".
 */
export class GroupParselet implements PrefixParselet {
    parse(parser: Parser, token: Token): Expression {
        const expression: Expression = parser.parseExpression();
        parser.consumeExpected(TokenType.RIGHT_PAREN);
        return expression;
    }
}
