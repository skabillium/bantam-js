import { Token, TokenType, Punctuators } from './tokens';

export class Lexer {
    private position: number = 0;

    constructor(private text: string) {}

    public next(): Token {
        while (this.position < this.text.length) {
            const char: string = this.text.charAt(this.position);
            this.position++;

            const punc = Punctuators.findIndex((p) => p === char);
            if (punc != -1) {
                return { type: punc, text: char };
            } else if (this.isLetter(char)) {
                let start: number = this.position - 1;
                while (this.position < this.text.length) {
                    if (!this.isLetter(this.text.charAt(this.position))) break;
                    this.position++;
                }

                const name: string = this.text.substring(start, this.position);
                return { type: TokenType.NAME, text: name };
            } else {
                // Ignore all other characters & whitespace
            }
        }
        // Once we've reached the end of the string, just return EOF tokens. We'll
        // just keeping returning them as many times as we're asked so that the
        // parser's lookahead doesn't have to worry about running out of tokens.
        return { type: TokenType.EOF, text: '' };
    }

    private isLetter(char: any) {
        return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z');
    }
}
