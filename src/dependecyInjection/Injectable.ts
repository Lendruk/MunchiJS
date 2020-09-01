import { Injector } from "./Injector";

export const Injectable = (): ClassDecorator => {
    return (target: any) => {
        Injector.instance.registerService(target);
    };
};
