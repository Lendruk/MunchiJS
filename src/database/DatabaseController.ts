import { Model } from "./Model";

export abstract class DatabaseController {
  public abstract init(...options: Array<string | object | number | boolean>): void;

  public abstract saveResource<ResourceKey, T extends Model<ResourceKey>>(item: T): Promise<T>;

  public abstract findResource<ResourceKey, T extends Model<ResourceKey>>(resourceId: ResourceKey): Promise<T>;

  public abstract hasResource<ResourceKey>(resourceId: ResourceKey): Promise<boolean>;

  public abstract deleteResource<ResourceKey>(resourceId: ResourceKey): Promise<boolean>;
}
