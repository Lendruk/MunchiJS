import io, { Server, Socket } from "socket.io";
import http from "http";
import { Constructable } from "./interfaces/Constructable";
import { BaseController } from "./BaseController";

export class SocketServer {
    socketServer: Server;
    socketEvents: Array<EventType>;

    constructor(httpServer: http.Server) {
        this.socketServer = io(httpServer);
        this.socketEvents = [];
        this.registerSockets = this.registerSockets.bind(this);
    }

    registerSockets(instance: BaseController, controller: Constructable<BaseController>): void {
        if (Reflect.hasMetadata("socketEvents", controller)) {
            const events = Reflect.getMetadata("socketEvents", controller) as Array<EventType>;
            this.socketEvents = this.socketEvents.concat(events);
        }
    }

    listen(): void {
        this.socketServer.on("connection", (socket) => {
            console.log("user has connected");

            for (const event of this.socketEvents) {
                socket.on(event.eventName, (data) => event.method(this.socketServer, socket, data));
            }
        });
    }
}

export const SocketEvent = (eventName: string): MethodDecorator => {
    return (target, propertyKey: string | symbol): void => {
        if (!Reflect.hasMetadata("socketEvents", target.constructor)) {
            Reflect.defineMetadata("socketEvents", [], target.constructor);
        }

        const events = Reflect.getMetadata("socketEvents", target.constructor) as Array<EventType>;

        events.push({
            eventName,
            method: target.constructor.prototype[propertyKey],
        });
    };
};

type EventType = {
    eventName: string;
    method: (SocketServer: Server, socket: Socket, data?: any) => void;
};
