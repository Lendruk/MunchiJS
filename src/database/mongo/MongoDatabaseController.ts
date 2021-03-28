import { Injectable } from "../../dependecyInjection/Injectable";
import { mongoose } from "../Database";
import { DatabaseController } from "../DatabaseController";
import { Model } from "../Model";
import ObjectId from "./ObjectId";

@Injectable()
export class MongoDatabaseController extends DatabaseController {
  public async init(url: string, options: mongoose.ConnectOptions, debug: boolean): Promise<void> {
    mongoose.set("debug", debug);
    await mongoose.connect(url, options);
  }

  public async retrieveAll<ResourceId, T extends Model<ResourceId>>(): Promise<T[]> {
    let obj!: new () => T;
    const model = mongoose.model(obj.name);
    try {
      // TODO - remove any
      return (await model.find({})) as any;
    } catch (error) {
      throw new Error(`${error} - Could not fetch the resource due to a database error`);
    }
  }

  public async findResource<T extends Model<ResourceId>, ResourceId = ObjectId>(resourceId: ResourceId): Promise<T> {
    let obj!: new () => T;
    const model = mongoose.model(obj.name);
    try {
      // TODO - remove any
      return (await model.findOne({ _id: resourceId })) as any;
    } catch (error) {
      throw new Error(`${error} - Could not fetch the resource due to a database error`);
    }
  }

  public async saveResource<T extends Model<ResourceId>, ResourceId>(item: T): Promise<T> {
    let obj!: new () => T;
    const model = mongoose.model(obj.name);
    try {
      // TODO - Replace any
      return (await model.create(item)) as any;
    } catch (error) {
      throw new Error("Could not create a new resource");
    }
  }

  public async deleteResource<T extends Model<ResourceId>, ResourceId = ObjectId>(
    resourceId: ResourceId
  ): Promise<boolean> {
    let obj!: new () => T;
    const model = mongoose.model(obj.name);
    try {
      return !!(await model.deleteOne({ _id: resourceId }));
    } catch (error) {
      return false;
    }
  }

  public async hasResource<T extends Model<ResourceId>, ResourceId = ObjectId>(
    resourceId: ResourceId
  ): Promise<boolean> {
    let obj!: new () => T;
    const model = mongoose.model(obj.name);
    try {
      return !!(await model.findOne({ _id: resourceId }));
    } catch (error) {
      return false;
    }
  }
}
