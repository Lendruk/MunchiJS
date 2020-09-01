import TemplateEngine, { IndexableObject } from "./TemplateEngine";

export const forLoop = (input: string, options?: IndexableObject) => {

};

export const variableAction = (tokenValue: string, options?: object): string => {
    return TemplateEngine.extractVariable(tokenValue.replace(/[{}]/g, ""), options);
};
