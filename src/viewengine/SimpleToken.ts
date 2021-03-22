import { ActionFunction } from "./DynamicToken";
import Token from "./Token";

export type TokenPair = { expStart: string; expEnd: string };

export class SimpleToken extends Token {
  private actionFunc: ActionFunction;

  constructor(expStart: string, expEnd: string, actionFunction: ActionFunction, enclosers?: Array<TokenPair>) {
    super(expStart, expEnd, enclosers);
    this.actionFunc = actionFunction;
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

  public execute(input: string, options: object): string {
    return this.actionFunc(input, options);
  }
}
