import { Inject } from "../dependecyInjection/Inject";
import { DatabaseController } from "./DatabaseController";
import { Model } from "./Model";

export abstract class Query<Model, ResourceKey> {
  abstract find(query: object): Promise<Model | undefined>;

  abstract findAll(): Promise<Model[]>;
}

export class ModelQuery<ResourceId, T extends Model<ResourceId>> {
  @Inject()
  private databaseController!: DatabaseController;
  items?: T[];

  async findById(resourceId: ResourceId): Promise<this> {
    this.items = [await this.databaseController.findResource<ResourceId, T>(resourceId)];
    return this;
  }

  async findAll(): Promise<this> {
    this.items = await this.databaseController.retrieveAll<ResourceId, T>();
    return this;
  }
}
