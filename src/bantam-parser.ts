import { Lexer } from './lexer';
import {
    AssignParselet,
    BinaryOperatorParselet,
    CallParselet,
    ConditionalParselet,
    GroupParselet,
    NameParselet,
    PostfixOperatorParselet,
    PrefixOperatorParselet,
} from './parselets';
import { Parser } from './parser';
import { Precedence } from './precedence';
import { TokenType } from './tokens';

// Extend the generic Parser class with support for the Bantam grammar
export class BantamParser extends Parser {
    constructor(lexer: Lexer) {
        super(lexer);

        // Register all of the parselets for the grammar
        this.registerPrefix(TokenType.NAME, new NameParselet());
        this.registerPrefix(TokenType.LEFT_PAREN, new GroupParselet());

        this.registerInfix(TokenType.ASSIGN, new AssignParselet());
        this.registerInfix(TokenType.QUESTION, new ConditionalParselet());
        this.registerInfix(TokenType.LEFT_PAREN, new CallParselet());

        // Register the simple operator parselets.
        this.prefix(TokenType.PLUS, Precedence.PREFIX);
        this.prefix(TokenType.MINUS, Precedence.PREFIX);
        this.prefix(TokenType.TILDE, Precedence.PREFIX);
        this.prefix(TokenType.BANG, Precedence.PREFIX);

        // For kicks, we'll make "!" both prefix and postfix, kind of like ++.
        this.postfix(TokenType.BANG, Precedence.POSTFIX);

        this.infixLeft(TokenType.PLUS, Precedence.SUM);
        this.infixLeft(TokenType.MINUS, Precedence.SUM);
        this.infixLeft(TokenType.ASTERISK, Precedence.PRODUCT);
        this.infixLeft(TokenType.SLASH, Precedence.PRODUCT);
        this.infixRight(TokenType.CARET, Precedence.EXPONENT);
    }

    /**
     * Registers a postfix unary operator parselet for the given token and
     * precedence.
     */
    postfix(token: TokenType, precedence: number): void {
        this.registerInfix(token, new PostfixOperatorParselet(precedence));
    }

    /**
     * Registers a prefix unary operator parselet for the given token and
     * precedence.
     */
    prefix(token: TokenType, precedence: number): void {
        this.registerPrefix(token, new PrefixOperatorParselet(precedence));
    }

    /**
     * Registers a left-associative binary operator parselet for the given token
     * and precedence.
     */
    infixLeft(token: TokenType, precedence: number): void {
        this.registerInfix(
            token,
            new BinaryOperatorParselet(precedence, false),
        );
    }

    /**
     * Registers a right-associative binary operator parselet for the given token
     * and precedence.
     */
    infixRight(token: TokenType, precedence: number): void {
        this.registerInfix(token, new BinaryOperatorParselet(precedence, true));
    }
}
