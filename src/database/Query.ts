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
  result?: T;

  async findById(resourceId: ResourceId): Promise<this> {
    this.result = await this.databaseController.findResource<ResourceId, T>(resourceId);
    return this;
  }
  // abstract findOne(): Promise<this>;
}
