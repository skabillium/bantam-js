// Helper class for incrementally building a string
export class StringBuilder {
    constructor(private str: string = '') {
        this.str = str;
    }

    append(...strs: string[]): void {
        strs.forEach((s) => (this.str += s));
    }

    toString(): string {
        return this.str;
    }
}
