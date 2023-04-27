import { Expression } from './expressions';
import { Lexer } from './lexer';
import { InfixParselet, PrefixParselet } from './parselets';
import { Precedence } from './precedence';
import { Token, TokenType } from './tokens';

export class Parser {
    prefixParselets = new Map<TokenType, PrefixParselet>();
    infixParselets = new Map<TokenType, InfixParselet>();

    readTokens: Token[] = [];

    constructor(private lexer: Lexer) {}

    parseExpression(precedence: number = Precedence.NONE): Expression {
        let token = this.consume();
        const prefix = this.prefixParselets.get(token.type);

        if (!prefix) {
            throw new Error(`Could not parse \'${token.text}\'.`);
        }

        let left: Expression = prefix.parse(this, token);
        while (precedence < this.getPrecedence()) {
            token = this.consume();
            if (token.type === TokenType.EOF) return left;

            const infix = this.infixParselets.get(token.type);

            if (!infix) {
                throw new Error(`Invalid infix ${token.text}`);
            }

            try {
                left = infix.parse(this, left, token);
            } catch (error) {
                console.log(token);
                throw error;
            }
        }

        return left;
    }

    registerPrefix(token: TokenType, parselet: PrefixParselet) {
        this.prefixParselets.set(token, parselet);
    }

    registerInfix(token: TokenType, parselet: InfixParselet) {
        this.infixParselets.set(token, parselet);
    }

    getPrecedence() {
        const parser = this.infixParselets.get(this.lookAhead(0).type);
        if (parser) return parser.getPrecedence();

        return Precedence.NONE;
    }

    lookAhead(distance: number): Token {
        while (distance >= this.readTokens.length) {
            this.readTokens.push(this.lexer.next());
        }

        return this.readTokens[distance];
    }

    consumeExpected(expected: TokenType): Token {
        const token = this.lookAhead(0);
        if (token.type !== expected) {
            throw new Error(
                `Expected token ${expected} and found ${token.type}`,
            );
        }

        return this.consume();
    }

    consume(): Token {
        this.lookAhead(0);
        return this.remove(0);
    }

    match(expected: TokenType): boolean {
        const token: Token = this.lookAhead(0);
        if (token.type !== expected) return false;

        this.consume();
        return true;
    }

    remove(index: number): Token {
        return this.readTokens.splice(index, 1)[0];
    }
}
