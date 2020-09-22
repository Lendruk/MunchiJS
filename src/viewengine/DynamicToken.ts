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

type ActionArguments = { action: string; args: Array<string> };

export class DynamicToken extends Token {
    private actions: Map<string, Action>;

    constructor(expStart: string, expEnd: string, actions: Map<string, Action>, enclosers: Array<TokenPair> = []) {
        super(expStart, expEnd, enclosers);
        this.actions = actions;
    }

    getActions(): Map<string, Action> {
        return this.actions;
    }

    getAction(handler: string): Action | undefined {
        return this.actions.get(handler);
    }

    public execute(input: string, options: object): string {
        const processedInput = this.processInputString(this.evaluateExpression(input));
        console.log("processedInput", processedInput);
        return "";
    }

    private processInputString(input: string): Array<ActionArguments> {
        const split = input.split(" ");
        const actionParams: Array<ActionArguments> = [];
        for (let i = 0; i < split.length; i++) {
            let lastActionIndex = 0;
            const part = split[i];
            if (this.actions.has(part.toUpperCase())) {
                actionParams.push({ action: part, args: [] });
                lastActionIndex = i;
            } else {
                actionParams[lastActionIndex].args.push(part);
            }
        }
        return actionParams;
    }

    /**
     * !Does not work if some argument contains word render
     * @param input input
     */
    private evaluateExpression(input: string): string {
        let splitExpression = input.split("=>");
        let expression = "";
        if (splitExpression.length > 0) {
            expression = splitExpression[0];
        } else {
            splitExpression = input.split("render");
            if (splitExpression.length > 0) {
                expression = splitExpression[0];
            }
        }

        if (!expression) throw new Error("No return found for expression");

        return expression;
    }
}
