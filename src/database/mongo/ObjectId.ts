import { mongoose } from "../Database";
import { ResourceId } from "../ResourceId";
export default class ObjectId extends mongoose.Schema.Types.ObjectId implements ResourceId {}
