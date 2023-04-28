# Bantam (Pratt) parser

This is a Javascript/Typescript port of "Bantam", a tiny little toy language, take a look at [Bob Nystrom's blog post](http://journal.stuffwithstuff.com/2011/03/19/pratt-parsers-expression-parsing-made-easy/) for a full explanation. It basically only has expressions since that's where Pratt parsing is really helpful.

Bantam may be straightforward, but it boasts a complete range of operators, including prefix (+, -, ~, !), postfix (!), infix (+, -, \*, /, ^), and a unique mixfix conditional operator (?:). It features various levels of precedence, both right and left associative operators, as well as assignment, function calls, and parentheses for grouping. If one can successfully parse Bantam, it is safe to say that they can parse anything.

This project was inspired by the aforementioned blog post since it is one of the best articles on the subject. It is pretty faithful to the original with some changes to accomodate Typescript's idioms.

## Installation

Requirements:

-   NodeJs
-   Yarn

To install the project run `yarn install` in the project's root directory to install typescript, the only dependency. After that run `yarn build` to generate the Javascript files & run them with `yarn run`. You can also use `yarn dev` to run typescript in watch mode should you make any changes.

In the `src/main.ts` file you can also find 24 test cases to verify the parser.
