import { mongoose } from "./database/Database";
import ObjectId from "./database/mongo/ObjectId";

export class BaseModel extends mongoose.Document {
  _id!: ObjectId;
}
