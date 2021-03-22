export const Controller = (prefix = ""): ClassDecorator => {
  return (target: Function): void => {
    Reflect.defineMetadata("prefix", prefix, target);

    if (!Reflect.hasMetadata("routes", target)) {
      Reflect.defineMetadata("routes", [], target);
    }

    for (const propertyKey of Object.getOwnPropertyNames(target.prototype)) {
      console.log(propertyKey);
      console.log(target.prototype[propertyKey]);
      console.log(Reflect.getMetadata("design:returntype", target.prototype, propertyKey));
    }
  };
};
