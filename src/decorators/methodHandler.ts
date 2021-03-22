import { RouteType } from "./routeType";
import { RouteOptions } from "../types/RouteOptions";

export const MethodHandler = (method: "get" | "put" | "post" | "patch" | "delete") => {
  return (path: string, routeOptions?: RouteOptions): MethodDecorator => {
    // target = class
    // propertyKey = decorated Method
    return (target, propertyKey: string | symbol): void => {
      if (!Reflect.hasMetadata("routes", target.constructor)) {
        Reflect.defineMetadata("routes", [], target.constructor);
      }

      const routes = Reflect.getMetadata("routes", target.constructor) as Array<RouteType>;

      routes.push({
        requestMethod: method,
        path,
        methodName: propertyKey,
        propertyKey,
        routeOptions,
      });

      Reflect.defineMetadata("routes", routes, target.constructor);
    };
  };
};
