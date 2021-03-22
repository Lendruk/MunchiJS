export const View = (viewName: string): MethodDecorator => {
  return (target, propertyKey: string | symbol): void => {
    if (!Reflect.hasMetadata("views", target.constructor)) {
      Reflect.defineMetadata("views", [], target.constructor);
    }

    const views = Reflect.getMetadata("views", target.constructor) as Array<View>;

    views.push({ view: viewName, method: propertyKey as string });

    Reflect.defineMetadata("views", views, target.constructor);
  };
};

export type View = {
  view: string;
  method: string;
};
