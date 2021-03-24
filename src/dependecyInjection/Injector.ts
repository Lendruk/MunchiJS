export class Injector {
  static instance: Injector;
  private serviceMap: Map<any, Array<any>>;

  constructor() {
    this.serviceMap = new Map();

    // If the singleton hasn't been created yet
    // assign it
    if (!Injector.instance) {
      Injector.instance = this;
    }
  }

  private hasService(service: any): boolean {
    const keys = this.serviceMap.keys();
    let key = keys.next();
    while (!key.done) {
      if (key.value instanceof service) return true;
      key = keys.next();
    }
    return false;
  }

  public retrieveService(service: any): any | null {
    const keys = this.serviceMap.keys();
    let key = keys.next();
    while (!key.done) {
      if (key.value instanceof service) return { service: key.value, consumers: this.serviceMap.get(key.value) };
      key = keys.next();
    }

    return null;
  }

  public registerService(service: any, ...args: any): void {
    if (!this.hasService(service)) {
      this.serviceMap.set(new service(...args), new Array<any>());
    }
  }

  public registerConsumer(service: any, consumer: any): void {
    if (!this.hasService(service)) {
      this.registerService(service);
    }
    const servicePair = this.retrieveService(service);
    const consumers = servicePair?.consumers;
    consumers?.push(consumer);
    this.serviceMap.set(service, consumers || new Array<any>());

    return servicePair?.service;
  }
}
