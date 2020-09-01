import { NextFunction, Response } from "express";
import { RouteOptions } from "../types/RouteOptions";
import { Request } from "../types/Request";

export interface RouteType {
    path: string;

    requestMethod: "get" | "post" | "put" | "patch" | "delete";

    methodName: string | symbol;

    middleware?: Function[];

    propertyKey?: string | symbol;

    routeOptions?: RouteOptions;
}

export interface MiddyPair {
    functions: Array<MiddyFunction>;
    method: string | symbol;
}

export type MiddyFunction = (req: Request, res: Response, next: NextFunction) => void;
