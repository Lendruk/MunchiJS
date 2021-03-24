import express, { NextFunction } from "express";
import "reflect-metadata";
import e from "express";
import bodyParser from "body-parser";
import cors from "cors";
import http from "http";
import { Injector } from "./dependecyInjection/Injector";
import { ControllerExtractor } from "./ControllerExtractor";
import { RouteAggregator } from "./RouteAggregator";
import { SocketServer } from "./SocketServer";
import { ErrorManager } from "./ErrorManager";
import { MiddyFunction } from "./decorators/routeType";
import { Request } from "./types/Request";
import { Response } from "./types/Response";
import TemplateEngine from "./viewengine/TemplateEngine";
import { BaseController } from "./BaseController";

export default class App {
  static controllers: Set<BaseController> = new Set();
  static instance: App;
  app: e.Express;
  engine!: TemplateEngine;
  aggregator: RouteAggregator;

  constructor(options?: {
    plugins?: Array<MiddyFunction>;
    errorHandler?: (errorFormat: any, req: Request, res: Response, next: NextFunction) => void;
    debug?: boolean;
    errorType?: {};
    authentication?: {};
    port?: number;
  }) {
    App.instance = this;
    this.app = express();
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));

    if (options?.plugins) this.applyPlugins(options?.plugins);

    // Initialize the dependecy injection
    const injector = new Injector();

    // Create the server
    const httpServer = http.createServer(this.app);

    const controllerExtractor = new ControllerExtractor();

    // Aggregate all the controllers
    this.aggregator = new RouteAggregator(this.app, options?.debug);
    controllerExtractor.addTask(this.aggregator.registerView);
    controllerExtractor.addTask(this.aggregator.aggregateRoutes);

    injector.registerService(SocketServer, httpServer);
    const socketServer = Injector.instance.retrieveService(SocketServer)?.service as SocketServer;

    controllerExtractor.addTask(socketServer.registerSockets);

    controllerExtractor.executeTasks();

    socketServer.listen();

    //Error Handler
    this.app.use(options?.errorHandler ? options.errorHandler : ErrorManager.handleError);
    const serverPort = options?.port ? options.port : 4000;
    httpServer.listen(serverPort);
    console.log(`server listening on port ${serverPort}`);
  }

  static getControllers(): Set<BaseController> {
    return this.controllers;
  }

  static addController(controller: BaseController): void {
    this.controllers.add(controller);
  }

  private applyPlugins(plugins: Array<MiddyFunction>): void {
    for (const plugin of plugins) {
      this.app.use(plugin);
    }
  }
}
