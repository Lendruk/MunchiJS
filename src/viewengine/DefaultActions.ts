import { Action } from "./DynamicToken";

export default class DefaultActions {
    static actions: Map<DefaultActionTypes, Action> = new Map();

    static start(): void {
        const forAction: Action = { key: "for", action: () => {}, args: [] };
        this.actions.set("FOR", forAction);
    }
}

export type DefaultActionTypes = "FOR" | "IF" | "RENDER";
