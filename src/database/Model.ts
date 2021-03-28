import { DatabaseController } from "./DatabaseController";
import { Inject } from "../dependecyInjection/Inject";
import { Constructable } from "../interfaces/Constructable";
import { ModelQuery } from "./Query";
import { ResourceId } from "./ResourceId";

export abstract class Model<ResourceKey> {
  private resourceId!: ResourceKey;
  @Inject()
  private databaseController!: DatabaseController;

  public async save(): Promise<void> {
    this.databaseController.saveResource(this);
  }

  public async delete(): Promise<boolean> {
    return this.databaseController.deleteResource(this.resourceId);
  }

  public async update(): Promise<boolean> {
    return false;
  }

  static async findAll<T extends Model<Y>, Y>(this: Constructable<T>): Promise<T[]> {
    const arr: T[] = [];
    return arr;
  }

  static async findById<T extends Model<ResourceId>>(
    this: Constructable<T>,
    id: ResourceId
  ): Promise<ModelQuery<ResourceId, T>> {
    const query = new ModelQuery<ResourceId, T>().findById(id);
    return query;
  }
}
