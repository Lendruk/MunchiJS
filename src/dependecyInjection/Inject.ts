import { Injector } from "./Injector";

export const Inject = (): PropertyDecorator => {
    return (target: any, propertyKey: string | symbol) => {
        const service = Injector.instance.registerConsumer(
            Reflect.getMetadata("design:type", target, propertyKey as string),
            target
        );
        target[propertyKey] = service;
    };
};
