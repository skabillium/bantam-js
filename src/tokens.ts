export enum TokenType {
    LEFT_PAREN,
    RIGHT_PAREN,
    COMMA,
    ASSIGN,
    PLUS,
    MINUS,
    ASTERISK,
    SLASH,
    CARET,
    TILDE,
    BANG,
    QUESTION,
    COLON,
    NAME,
    EOF,
}

// Parallel array for punctuators
export const Punctuators = [
    '(', // LEFT_PAREN
    ')', // RIGHT_PAREN
    ',', // COMMA
    '=', // ASSIGN
    '+', // PLUS
    '-', // MINUS
    '*', // ASTERISK
    '/', // SLASH
    '^', // CARET
    '~', // TILDE
    '!', // BANG
    '?', // QUESTION
    ':', // COLON
];

export type Token = {
    type: TokenType;
    text: string;
};
