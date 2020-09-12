import { Match } from "./Match";
import { Action } from "./TemplateEngine";

export type Token = {
    expStart: string;
    expEnd: string;
    enclosers?: Array<Token>;
};

export default class Parser {
    actions: Array<Action>;
    options: object;

    constructor(actions: Array<Action>, options?: object) {
        this.actions = actions;
        this.options = options || {};
    }

    parse(chunk: string): string {
        const currentMatches = new Map<string, number>();
        return this.parseChunkData(chunk, currentMatches);
    }

    parseChunkData(chunk: string, currentMatches: Map<string, number>): string {
        let searchIndex = 0;
        let output = "";
        for (let i = 0; i < chunk.length; i++) {
            const endLineIndex = chunk.indexOf("\n", searchIndex);
            const curLine = (endLineIndex !== -1 ? chunk.slice(i, endLineIndex) : chunk.slice(i)).toString();
            output = this.parseLine(curLine, output, currentMatches);

            if (endLineIndex === -1) break;
            searchIndex = endLineIndex + 1;
            i = i + (endLineIndex - i);
        }

        return output;
    }

    parseLine(line: string, chunkOutput: string, currentMatches: Map<string, number>): string {
        let res = chunkOutput + line;
        console.log("line", line);
        for (const action of this.actions) {
            const { token } = action;
            // There's an open expression
            if (currentMatches.has(token.expStart)) {
                const regex = this.buildTokenRegex(token.expEnd);
                const index = regex.exec(line)?.index;
                if (index != null && index !== -1) {
                    const match: Match = {
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        chunkIndex: currentMatches.get(token.expStart)!,
                        chunkIndexEnd: chunkOutput.length + index,
                        globalIndex: chunkOutput.length,
                        expStart: token.expStart,
                        expEnd: token.expEnd,
                    };
                    currentMatches.delete(token.expStart);
                    console.log("value", match);
                    const value = action.function(
                        res.slice(match.chunkIndex, match.chunkIndexEnd + token.expEnd.length),
                        this.options
                    );
                    // console.log("res", res);
                    res = res.slice(0, match.chunkIndex) + value;
                    res = this.parseLine(line.slice(index + token.expEnd.length), res, currentMatches);
                }
            } else {
                const regex = this.buildTokenRegex(token.expStart);
                const index = regex.exec(line)?.index;
                if (index != null && index !== -1 && !this.hasEnclosers(currentMatches, token.enclosers)) {
                    currentMatches.set(token.expStart, index + chunkOutput.length);
                    res = this.parseLine(line, chunkOutput, currentMatches);
                }
            }
        }

        return res;
    }

    private hasEnclosers(map: Map<string, number>, enclosers?: Array<Token>): boolean {
        if (!enclosers) return false;

        for (const enclosure of enclosers.map((encloser) => encloser.expStart)) {
            if (map.has(enclosure)) return true;
        }

        return false;
    }

    private buildTokenRegex(token: string): RegExp {
        return new RegExp(`(?<!${token})${token}(?!${token})`, "g");
    }
}
