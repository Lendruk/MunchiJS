import TemplateEngine from "./TemplateEngine";

export const forLoop = (tokenValue: string, options?: object): string => {
  // console.log("forValue", tokenValue);
  return tokenValue;
};

export const variableAction = (tokenValue: string, options?: object): string => {
  return TemplateEngine.extractVariable(tokenValue, options);
};
