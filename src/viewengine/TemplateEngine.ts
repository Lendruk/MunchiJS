import fs from "fs";
import Parser, { Token } from "./Parser";

export type IndexableObject = { [index: string]: any };

type ActionFunction = (tokenValue: string, options?: IndexableObject) => string;

export type Action = {
    function: ActionFunction;
    handler: string;
    token: Token;
};

export default class TemplateEngine {
    viewDirectory: string;
    actions: Array<Action>;

    constructor(viewDirectory: string) {
        this.viewDirectory = viewDirectory;
        this.actions = [];
    }

    registerAction(action: ActionFunction, handler: string): void {
        if (this.actions.find((act) => act.handler === handler))
            throw new Error("Cannot have more than one action with the same handler");

        this.actions.push({ function: action, handler, token: { expStart: "{{", expEnd: "}}" } });
    }

    registerToken(action: ActionFunction, token: Token): void {
        this.actions.push({ function: action, token, handler: "" });
    }

    /**
     * Creates a ReadStream from the supplied view component and renders it.
     * @param viewComp The name of the view component. (Refers to the name of the folder)
     * @param options Object containing properties that will be used by the template
     */
    async render(viewComp: string, options?: object): Promise<string> {
        const stream = fs.createReadStream(`${process.cwd()}/app/${this.viewDirectory}/${viewComp}/index.munch`);
        const parser = new Parser(this.actions, options);
        let output = "";
        for await (const chunk of stream) {
            output += parser.parse(chunk);
        }
        return output;
    }

    /**
     * Parses the variable string and matches it with the options object in order to retrieve the value
     * of the variable. Ex "user.name"
     * @param variable the name of the variable
     * @param options the object which contains variables to be used on the view
     */
    static extractVariable(variable: string, options?: IndexableObject): string {
        if (!options) return "";
        const variableParts = variable.split(".");
        const baseVariable = variableParts.shift();
        return variableParts.length > 0
            ? this.extractVariable(variableParts.join("."), baseVariable && options[baseVariable])
            : this.stringifyAnyObject(options[variable]);
    }

    /**
     * Turns any kind of object into a string
     * @param obj object what will be stringified
     */
    static stringifyAnyObject(obj: any): string {
        return typeof obj === "object" ? JSON.stringify(obj) : obj;
    }
}
