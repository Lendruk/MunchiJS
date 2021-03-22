import { TokenPair } from "./SimpleToken";

export default abstract class Token {
  private _expStart: string;
  public get expStart(): string {
    return this._expStart;
  }

  private _expEnd: string;
  public get expEnd(): string {
    return this._expEnd;
  }

  private _enclosers?: Array<TokenPair>;
  public get enclosers(): Array<TokenPair> | undefined {
    return this._enclosers;
  }
  public set enclosers(value: Array<TokenPair> | undefined) {
    this._enclosers = value;
  }

  constructor(expStart: string, expEnd: string, enclosers?: Array<TokenPair>) {
    this._expStart = expStart;
    this._expEnd = expEnd;
    this._enclosers = enclosers;
  }

  public abstract execute(input: string, options: object): string;
}
