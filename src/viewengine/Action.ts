import { IndexableObject } from "./TemplateEngine";
import { Token, TokenPair } from "./Token";

export type ActionFunction = (tokenValue: string, options?: IndexableObject) => string;

export class Action extends Token {
    private handler: string;

    constructor(
        expStart: string,
        expEnd: string,
        actionFunc: ActionFunction,
        handler: string,
        enclosers: Array<TokenPair> = []
    ) {
        super(expStart, expEnd, actionFunc, enclosers);
        this.handler = handler;
    }

    getHandler(): string {
        return this.handler;
    }
}
