import { IndexableObject } from "./TemplateEngine";
import { TokenPair } from "./SimpleToken";
import Token from "./Token";

export type ActionFunction = (tokenValue: string, options?: IndexableObject) => string;

export class Action extends Token {
    private handlerMap: Map<string, ActionFunction>;

    constructor(
        expStart: string,
        expEnd: string,
        handlerMap: Map<string, ActionFunction>,
        enclosers: Array<TokenPair> = []
    ) {
        super(expStart, expEnd, enclosers);
        this.handlerMap = handlerMap;
    }

    getHandlers(): Map<string, ActionFunction> {
        return this.handlerMap;
    }

    public executeAction(input: string, options: object): string {
        return "";
    }
}
