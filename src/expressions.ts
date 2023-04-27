import { TokenType, Punctuators } from './tokens';
import { StringBuilder } from './string-builder';

export interface Expression {
    print(builder: StringBuilder): void;
}

export class AssignExpression implements Expression {
    constructor(private name: string, private right: Expression) {}

    print(builder: StringBuilder): void {
        builder.append('(', this.name, ' = ');
        this.right.print(builder);
        builder.append(')');
    }
}

export class CallExpression implements Expression {
    constructor(private func: Expression, private args: Expression[]) {}

    print(builder: StringBuilder): void {
        this.func.print(builder);
        builder.append('(');
        for (let i = 0; i < this.args.length; i++) {
            this.args[i].print(builder);
            if (i < this.args.length - 1) builder.append(', ');
        }

        builder.append(')');
    }
}

export class ConditionalExpression implements Expression {
    constructor(
        private condition: Expression,
        private thenArm: Expression,
        private elseArm: Expression,
    ) {}

    print(builder: StringBuilder): void {
        builder.append('(');
        this.condition.print(builder);

        builder.append(' ? ');
        this.thenArm.print(builder);

        builder.append(' : ');
        this.elseArm.print(builder);

        builder.append(')');
    }
}

export class NameExpression implements Expression {
    constructor(private name: string) {
        this.name = name;
    }

    print(builder: StringBuilder): void {
        builder.append(this.name);
    }

    getName() {
        return this.name;
    }
}

export class OperatorExpression implements Expression {
    constructor(
        private left: Expression,
        private operator: TokenType,
        private right: Expression,
    ) {}

    print(builder: StringBuilder): void {
        builder.append('(');
        this.left.print(builder);

        builder.append(' ', Punctuators[this.operator], ' ');
        this.right.print(builder);

        builder.append(')');
    }
}

export class PostfixExpression implements Expression {
    constructor(private left: Expression, private operator: TokenType) {}

    print(builder: StringBuilder): void {
        builder.append('(');
        this.left.print(builder);
        builder.append(Punctuators[this.operator], ')');
    }
}

export class PrefixExpression implements Expression {
    constructor(private operator: TokenType, private right: Expression) {}

    print(builder: StringBuilder): void {
        builder.append('(', Punctuators[this.operator]);
        this.right.print(builder);
        builder.append(')');
    }
}
