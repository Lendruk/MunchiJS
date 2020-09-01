import fs from "fs";
import { BaseController } from "./BaseController";
import { Constructable } from "./interfaces/Constructable";
import App from "./App";

export type ExtractorTask = (instance: BaseController, controller: Constructable<BaseController>) => any;

export class ControllerExtractor {
    private tasks: Array<ExtractorTask>;

    constructor() {
        this.tasks = [];
    }

    addTask(task: ExtractorTask): void {
        this.tasks.push(task);
    }

    executeTasks() {
        const files = fs.readdirSync(`${__dirname}/../../controllers`);
        const controllers = this.extractControllers(files);

        for (const controller of controllers) {
            const instance = new controller();
            App.addController(instance);

            for (const task of this.tasks) {
                task(instance, controller);
            }
        }
    }

    private extractControllers(files: string[]): Array<Constructable<BaseController>> {
        const controllers: Array<Constructable<BaseController>> = [];
        for (const file of files) {
            if (!file.includes("index") && !file.includes("BaseController")) {
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                const controller = require(`../../controllers/${file}`);
                controllers.push(Object.values(controller)[0] as Constructable<BaseController>);
            }
        }
        return controllers;
    }
}
