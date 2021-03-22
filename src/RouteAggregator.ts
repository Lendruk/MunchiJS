import { NextFunction } from "express";
import e from "express";
// Import Controllers
import { RouteType, MiddyPair, MiddyFunction } from "./decorators/routeType";
import { BaseController } from "./BaseController";
import { RouteOptions } from "./types/RouteOptions";
import { ErrorManager } from "./ErrorManager";
import { checkToken } from "./utils/checkToken";
import { Request } from "./types/Request";
import { Constructable } from "./interfaces/Constructable";
import { Response } from "./types/Response";
import App from "./App";
import { View } from "./decorators/ViewHandler";

export class RouteAggregator {
  private app: e.Express;
  private debug: boolean;

  /**
   *
   * @param app Express App
   * @param debug Debug flag currently used to send missing fields to front-end on calls
   */
  constructor(app: e.Express, debug?: boolean) {
    this.app = app;
    this.debug = Boolean(debug);
    // Binding the correct prototype
    this.aggregateRoutes = this.aggregateRoutes.bind(this);
    this.registerView = this.registerView.bind(this);
  }

  aggregateRoutes(instance: BaseController, controller: Constructable<BaseController>): void {
    // This is the route prefix ex. "/users"
    const prefix = Reflect.getMetadata("prefix", controller);
    const routes: Array<RouteType> = Reflect.getMetadata("routes", controller);
    const middlewares: Array<MiddyPair> = Reflect.getMetadata("middleware", controller);
    for (const route of routes) {
      const routeMiddleware = middlewares && middlewares.find((middy) => middy.method === route.methodName);

      this.app[route.requestMethod](
        (process.env.API_URL || "") + prefix + route.path,
        ...this.applyMiddleware(routeMiddleware, route.routeOptions, Boolean(route.routeOptions?.requireToken)),
        this.createEndpointHandler(instance, route.methodName as string)
      );
    }
  }

  registerView(instance: BaseController, controller: Constructable<BaseController>): void {
    const views: Array<View> = Reflect.getMetadata("views", controller);
    const routes: Array<RouteType> = Reflect.getMetadata("routes", controller);
    const prefix = Reflect.getMetadata("prefix", controller);

    if (!views) return;

    for (const view of views) {
      const routeIndex = routes.findIndex((rt) => rt.methodName === view.method);
      if (routeIndex === -1) throw new Error("A view needs to have a method handler associated to it");

      const route = routes.splice(routeIndex, 1)[0];
      Reflect.defineMetadata("routes", routes, controller);
      this.app[route.requestMethod](
        (process.env.API_URL || "") + prefix + route.path,
        (req: Request, res: Response): void => {
          const result = instance[route.methodName as string](req, res);
          if (result instanceof Promise) {
            result.then((methodResult) =>
              App.instance.engine.render(view.view, methodResult).then((rendered) => res.type("html").send(rendered))
            );
          } else {
            App.instance.engine.render(view.view, result).then((rendered) => res.type("html").send(rendered));
          }
        }
      );
    }
  }

  private applyMiddleware(
    middleware: MiddyPair | undefined,
    routeOptions: RouteOptions | undefined,
    requireToken: boolean
  ): Array<MiddyFunction> {
    let functions = new Array<MiddyFunction>();
    if (middleware != null) {
      functions = middleware.functions;
    }

    if (routeOptions && this.hasRequiredFields(routeOptions))
      functions = functions.concat(this.mapRequiredFields(routeOptions));

    if (requireToken) {
      functions = functions.concat(checkToken);
    }

    return functions;
  }

  private hasRequiredFields(routeOptions?: RouteOptions): boolean {
    return routeOptions
      ? Boolean(routeOptions.body?.required || routeOptions.headers?.required || routeOptions.params?.required)
      : false;
  }

  private mapRequiredFields(options: RouteOptions): MiddyFunction[] {
    const functions = new Array<MiddyFunction>();
    for (const key in options) {
      functions.push((req: Request, res: Response, next: NextFunction) => {
        const reqProp = Object.getOwnPropertyDescriptor(req, key);
        const missingFields = new Array<string>();

        if (reqProp != null && reqProp.value) {
          for (const field of options[key].required) {
            if (reqProp.value[field] == null) {
              if (this.debug) missingFields.push(field);
              else throw ErrorManager.errors.REQUIRED_FIELDS_EMPTY;
            }
          }
        }

        if (this.debug && missingFields.length > 0) throw ErrorManager.errors.FIELDS_EMPTY(key, missingFields);

        next();
      });
    }

    return functions;
  }

  private createEndpointHandler(
    controllerInstance: BaseController,
    methodName: string
  ): (req: Request, res: Response, next: NextFunction) => void {
    return (req: Request, res: Response, next: NextFunction): void => {
      try {
        const result = controllerInstance[methodName](req, res);
        if (result instanceof Promise) {
          result.then((promiseValues) => this.formatResponse(promiseValues, res)).catch((err) => next(err));
        } else {
          this.formatResponse(result, res);
        }
      } catch (error) {
        console.error(error);
      }
    };
  }

  private formatResponse(data: any, res: Response): void {
    let status = 200;
    const results: { [key: string]: any[] } = {};

    if (data) {
      for (const key in data) {
        if (key === "status") {
          status = data[key];
        } else {
          results[key] = data[key];
        }
      }
    }

    res.status(status).json(results);
  }
}
