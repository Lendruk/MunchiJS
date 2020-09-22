import { Match } from "./Match";
import { TokenPair } from "./SimpleToken";
import Token from "./Token";

export default class Parser {
    actions: Array<Token>;
    options: object;

    constructor(actions: Array<Token>, options?: object) {
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
        for (const action of this.actions) {
            // There's an open expression
            const expStart = action.expStart;
            const expEnd = action.expEnd;
            if (currentMatches.has(expStart)) {
                const regex = this.buildTokenRegex(expEnd);
                const index = regex.exec(line)?.index;
                if (index != null && index !== -1) {
                    const match: Match = {
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        chunkIndex: currentMatches.get(expStart)!,
                        chunkIndexEnd: chunkOutput.length + index,
                        globalIndex: chunkOutput.length,
                        expStart: expStart,
                        expEnd: expEnd,
                    };
                    currentMatches.delete(expStart);
                    const value = action.execute(
                        res
                            .slice(match.chunkIndex, match.chunkIndexEnd + expEnd.length)
                            .replace(this.buildTokenRegex(expStart), "")
                            .replace(this.buildTokenRegex(expEnd), ""),
                        this.options
                    );

                    res = res.slice(0, match.chunkIndex) + value;
                    res = this.parseLine(line.slice(index + expEnd.length), res, currentMatches);
                }
            } else {
                const regex = this.buildTokenRegex(expStart);
                const index = regex.exec(line)?.index;
                if (index != null && index !== -1 && !this.hasEnclosers(currentMatches, action.enclosers)) {
                    currentMatches.set(expStart, index + chunkOutput.length);
                    res = this.parseLine(line, chunkOutput, currentMatches);
                }
            }
        }

        return res;
    }

    private hasEnclosers(map: Map<string, number>, enclosers?: Array<TokenPair>): boolean {
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
