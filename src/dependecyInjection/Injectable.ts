import { Injector } from "./Injector";

export const Injectable = (): ClassDecorator => {
  return (target: any): void => {
    Injector.instance.registerService(target);
  };
};
