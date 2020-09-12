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
import { forLoop, variableAction } from "./viewengine/Actions";

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
    }) {
        App.instance = this;
        this.initViewengine();
        this.app = express();
        this.app.use(cors());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));

        // Register the view engine
        // const engine = new TemplateEngine("views");
        // this.app.engine("munch", (filePath, options, callback) => {
        //     console.log("filePath", filePath);
        //     try {
        //         engine.render("Home", options).then((res) => callback(null, res));
        //     } catch (e) {
        //         console.log("error", e);
        //     }
        // });
        // this.app.set("views", "../../views");
        // this.app.set("view engine", "munch");
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

        httpServer.listen(4000);
        console.log("server listening on port 4000");
    }

    private initViewengine(): void {
        this.engine = new TemplateEngine("views");
        this.engine.registerToken(variableAction, {
            expStart: "{",
            expEnd: "}",
            enclosers: [
                { expStart: "{{", expEnd: "}}" },
                { expStart: "<style>", expEnd: "</style>" },
            ],
        });
        this.engine.registerAction(forLoop, "for");
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
