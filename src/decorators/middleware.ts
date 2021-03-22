import { MiddyPair, MiddyFunction } from "./routeType";

export const Middleware = (...middlewares: Array<MiddyFunction>): MethodDecorator => {
  return (target: any, propertyKey: string | symbol): void => {
    if (!Reflect.hasMetadata("middleware", target.constructor)) {
      Reflect.defineMetadata("middleware", new Array<MiddyPair>(), target.constructor);
    }

    const methodsMiddlewares = Reflect.getMetadata("middleware", target.constructor) as Array<MiddyPair>;
    methodsMiddlewares.push({ method: propertyKey, functions: middlewares });
  };
};
