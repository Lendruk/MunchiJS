import { IndexableObject } from "./TemplateEngine";
import { TokenPair } from "./SimpleToken";
import Token from "./Token";

export type ActionFunction = (tokenValue: string, options?: IndexableObject) => string;

export type Action = {
  action: (options: object, ...args: any[]) => object | null;
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
    for (const actionParams of processedInput) {
      const action = this.actions.get(actionParams.action.toUpperCase());
      if (action) {
        // const res = action.action.call(null, options, ...actionParams.args);
      }
    }
    console.log("processedInput", processedInput);
    return "";
  }

  private processInputString(input: string): Array<ActionArguments> {
    const split = input.split(" ");
    const actionParams: Array<ActionArguments> = [];
    let lastActionIndex = -1;
    for (let i = 0; i < split.length; i++) {
      const part = split[i];
      if (!part.length) continue;

      if (this.actions.has(part.toUpperCase())) {
        actionParams.push({ action: part, args: [] });
        lastActionIndex += 1;
      } else if (lastActionIndex >= 0) {
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
    let renderCharacterIndex = input.indexOf("=>");
    let expression = "";

    if (renderCharacterIndex === -1) {
      renderCharacterIndex = input.indexOf("render");
      if (renderCharacterIndex !== -1) {
        expression = input.slice(0, renderCharacterIndex);
      }
    } else {
      expression = input.slice(0, renderCharacterIndex);
    }

    if (!expression) throw new Error("No return found for expression");

    return expression;
  }
}
