import { BantamParser } from './bantam-parser';
import { Lexer } from './lexer';
import { StringBuilder } from './string-builder';

type TestCase = {
    src: string;
    exp: string;
};

const TestCases: TestCase[] = [
    // Function calls
    { src: 'a()', exp: 'a()' },
    { src: 'a(b)', exp: 'a(b)' },
    { src: 'a(b, c)', exp: 'a(b, c)' },
    { src: 'a(b)(c)', exp: 'a(b)(c)' },
    { src: 'a(b) + c(d)', exp: '(a(b) + c(d))' },
    { src: 'a(b ? c : d, e + f)', exp: 'a((b ? c : d), (e + f))' },

    // Unary precedence
    { src: '"~!-+a', exp: '(~(!(-(+a))))' },
    { src: 'a!!!', exp: '(((a!)!)!)' },

    // Unary & binary precedence
    { src: '-a * b', exp: '((-a) * b)' },
    { src: '!a + b', exp: '((!a) + b)' },
    { src: '~a ^ b', exp: '((~a) ^ b)' },
    { src: '-a!', exp: '(-(a!))' },
    { src: '!a!', exp: '(!(a!))' },

    // Binary precedence
    {
        src: 'a = b + c * d ^ e - f / g',
        exp: '(a = ((b + (c * (d ^ e))) - (f / g)))',
    },

    // Binary associativity
    { src: 'a = b = c', exp: '(a = (b = c))' },
    { src: 'a + b - c', exp: '((a + b) - c)' },
    { src: 'a * b / c', exp: '((a * b) / c)' },
    { src: 'a ^ b ^ c', exp: '(a ^ (b ^ c))' },

    // Conditional operator
    { src: 'a ? b : c ? d : e', exp: '(a ? b : (c ? d : e))' },
    { src: 'a ? b ? c : d : e', exp: '(a ? (b ? c : d) : e)' },
    { src: 'a + b ? c * d : e / f', exp: '((a + b) ? (c * d) : (e / f))' },

    // Grouping
    { src: 'a + (b + c) + d', exp: '((a + (b + c)) + d)' },
    { src: 'a ^ (b + c)', exp: '(a ^ (b + c))' },
    { src: '(!a)!', exp: '((!a)!)' },
];

let passed = 0;
let failed = 0;

function run(source: string): string {
    const lexer = new Lexer(source);
    const parser = new BantamParser(lexer);

    const result = parser.parseExpression();

    const builder = new StringBuilder('');
    result.print(builder);

    return builder.toString();
}

function test(testCase: TestCase): void {
    const { src, exp } = testCase;

    try {
        const actual = run(src);

        if (actual === exp) {
            passed++;
        } else {
            failed++;
            console.log('[FAIL] Expected:', exp);
            console.log('         Actual:', actual);
        }
    } catch (e: any) {
        failed++;
        console.log('[FAIL] Expected:', exp);
        console.log('       Error:', e.message);
    }
}

function main() {
    TestCases.forEach(test);

    if (failed === 0) {
        console.log(`Passed all ${passed} tests.`);
    } else {
        console.log('----------------------------------------------');
        console.log(`Failed ${failed} out of ${failed + passed} tests.`);
    }
}

main();

process.exit();
