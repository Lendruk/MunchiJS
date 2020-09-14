import { ActionFunction } from "./Action";

export type TokenPair = { expStart: string; expEnd: string };

export class Token {
    private expStart: string;
    private expEnd: string;
    private actionFunc: ActionFunction;
    private enclosers?: Array<TokenPair>;

    constructor(expStart: string, expEnd: string, actionFunction: ActionFunction, enclosers?: Array<TokenPair>) {
        this.expStart = expStart;
        this.expEnd = expEnd;
        this.actionFunc = actionFunction;
        this.enclosers = enclosers;
    }

    getExpressionStart(): string {
        return this.expStart;
    }

    getExpressionEnd(): string {
        return this.expEnd;
    }

    getEnclosers(): Array<TokenPair> | undefined {
        return this.enclosers;
    }

    getAction(): ActionFunction {
        return this.actionFunc;
    }
}
