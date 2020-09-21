import { IndexableObject } from "./TemplateEngine";
import { TokenPair } from "./SimpleToken";
import Token from "./Token";

export type ActionFunction = (tokenValue: string, options?: IndexableObject) => string;

export type Action = {
    key: string;
    action: Function;
    args: Array<Argument>;
    nextAction?: Action;
};

export enum ArgumentType {
    SINGLE,
    MULTIPLE,
}

export type Argument = {
    type: ArgumentType;
    dataType: string | number | object;
};

export class DynamicToken extends Token {
    private actions: Array<Action>;

    constructor(expStart: string, expEnd: string, actions: Array<Action>, enclosers: Array<TokenPair> = []) {
        super(expStart, expEnd, enclosers);
        this.actions = actions;
    }

    getActions(): Array<Action> {
        return this.actions;
    }

    getAction(handler: string): Action | undefined {
        return this.actions.find((action) => action.key === handler);
    }

    public executeAction(input: string, options: object): string {
        return "";
    }
}
