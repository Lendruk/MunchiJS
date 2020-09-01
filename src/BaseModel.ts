import { mongoose } from "../../utils/database";
import ObjectId from "./ObjectId";

export class BaseModel extends mongoose.Document {
    _id!: ObjectId;
}
