# UntitledApiLibrary
WIP 
### Dependecy Injection
This Library includes an injector.
To inject a service the user needs to mark a class as being injectable.
```typescript
    @Injectable()
    export class ExampleClass {

        sayHello() {
            console.log("Hello");
        }
    }
```
In the consumer class if we want to use this class we can inject it.
```typescript
    export class ConsumerClass {

        @Inject()
        private _example!: ExampleClass;

        sayHello() {
            this._example.sayHello();
        }
    }
```
This will inject the instance of the ExampleClass into the _example variable. It uses the same instance (singleton) for every consumer of this service.

Although it is not being used right now, the injector keeps a list a list of the consumers of a certain service in a form of a map. `Map<Service, Array<Consumers>>`;

### Controller Route Aggregation
This API uses the MVC (Model-View-Controller) pattern, and as such we use controllers to create and use the business logic.
We use typescript decorators to register all the routes in express. To create a controller we need to annotate the class with the controller decorator and give it a path as such:
```typescript
    @Controller("/example")
    export class ControllerExample extends BaseController {
        // Routes Go Here

        @Get("/")
        getExample(req : Request) {
            return "hello";
        }
    }
```
This will register all methods in this controller on the route localhost:4000/api/example/

Note:
The view part of the MVC is not present in this API, the view can be a react or angular app for example.
### Middleware Functions (WIP)
```typescript
    @Get("/")
    @Middleware((req: Request, res: Response, next: NextFunction) => {
        // Code here
        next();
    })
    public async getUsers(req: Request) {
        return "string";
    }
```
### Method Options (WIP)
TODO description
### Socket Decorators (WIP)
TODO description
### View Engine (WIP)
