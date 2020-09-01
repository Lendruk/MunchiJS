import { PropertyOptions } from "../types/PropertyOptions";
import { mongoose } from "../../utils/database";
import { Model as MongooseModel, SchemaOptions } from "mongoose";
import { ModelProperties } from "../types/ModelProperties";
import ObjectId from "../ObjectId";
import { BaseModel } from "../classes/BaseModel";

function extractType(propOptions: any, items?: any) {
    const type = propOptions.type as Function;
    if (!type) return {};

    if (items) {
        if (Reflect.hasMetadata("properties", items) && !items.modelName) {
            delete propOptions.items;
            delete propOptions.type;
            return [{ ...propOptions, ...extractTypes(Reflect.getMetadata("properties", items)) }];
        } else {
            return [{ type: ObjectId, ref: items.modelName || items.name }];
        }
    } else {
        if (Reflect.hasMetadata("properties", type)) {
            return { ...propOptions, type: extractTypes(Reflect.getMetadata("properties", type)) };
        } else {
            return { ...propOptions };
        }
    }
}

function extractTypes(properties: any) {
    const schemaProperties: { [index: string]: any } = {};
    for (const property of properties) {
        const key = property.propertyKey;
        delete property.propertyKey;

        schemaProperties[key] = extractType(property, property.items);
    }

    return schemaProperties;
}

export const ModelOptions = (modelProperties: ModelProperties): ClassDecorator => {
    return (target: any) => {
        if (typeof target === "function") {
            if (!Reflect.hasMetadata("properties", target)) {
                Reflect.defineMetadata("properties", [], target);
            }

            Reflect.defineMetadata("ModelOptions", modelProperties, target);
        }
    };
};

export const Property = (modelProperty: PropertyOptions): PropertyDecorator => {
    return (target: any, propertyKey: string | symbol) => {
        if (!Reflect.hasMetadata("properties", target.constructor)) {
            Reflect.defineMetadata("properties", [], target.constructor);
        }

        const properties = Reflect.getMetadata("properties", target.constructor);
        properties.push({
            ...modelProperty,
            propertyKey,
            type: Reflect.getMetadata("design:type", target, propertyKey as string),
        });
    };
};

// Refactor this completely
export const getModelFromClass = <T extends BaseModel>(target: Function): MongooseModel<T> => {
    if (!Reflect.hasMetadata("properties", target)) {
        Reflect.defineMetadata("properties", [], target);
    }

    let modelOptions: ModelProperties = {};
    const schemaOptions: SchemaOptions = {};
    if (Reflect.hasMetadata("ModelOptions", target)) {
        modelOptions = Reflect.getMetadata("ModelOptions", target) as ModelProperties;
        if (modelOptions.noId) {
            schemaOptions._id = false;
        }
    }

    const schemaProperties = extractTypes(Reflect.getMetadata("properties", target));
    const schema = new mongoose.Schema(
        {
            ...schemaProperties,
        },
        { timestamps: { createdAt: "_created", updatedAt: "_modified" } }
    );

    // Add Static Functions
    for (const staticKey of Object.getOwnPropertyNames(target)) {
        if (!["length", "name", "prototype"].includes(staticKey)) {
            schema.statics[staticKey] = target[staticKey as keyof typeof target];
        }
    }

    // Add Methods
    for (const protoKey of Object.getOwnPropertyNames(target.prototype)) {
        if (protoKey !== "constructor") {
            const protoFunction = target.prototype[protoKey];
            schema.methods[protoKey] = protoFunction;
        }
    }

    if (modelOptions?.expireAfter) {
        schema.index({ _created: 1 }, { expireAfterSeconds: modelOptions.expireAfter.getSeconds() });
    }

    return mongoose.model<T>(target.name.replace(/(Model)+/g, ""), schema);
};
