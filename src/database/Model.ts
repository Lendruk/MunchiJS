import { DatabaseController } from "./DatabaseController";
import { Inject } from "../dependecyInjection/Inject";
import { Constructable } from "../interfaces/Constructable";
import ObjectId from "./mongo/ObjectId";

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

  static async findById<Y, T extends Model<Y> = Model<Y>>(this: Constructable<T>, id: Y): Promise<T[]> {
    const arr: T[] = [];
    return arr;
  }
}

// Model.test = 2;
class Test extends Model<ObjectId> {}
Test.findById<ObjectId>(new ObjectId("rr"));
Test.findAll();
// Test.test.
// Test.findById();
// Test.find({ name: "dae" });
