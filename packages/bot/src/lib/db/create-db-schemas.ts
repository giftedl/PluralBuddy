import zodMongoSchema from "@udohjeremiah/zod-mongo-schema";
import { PAlterObject, PSystemObject, PTagObject, PUserObject } from "plurography";
import z from "zod";
import type { JSONSchema } from "zod/v4/core";

/// @udohjeremiah/zod-mongo-schema is a good library, however it misses anything that is too complex. This will automatically recreate those types.

export function generateUserSchema() {
	const baseSchema = zodMongoSchema(
		z.object({
			_id: z.unknown().meta({ bsonType: "objectId" }),
			...PUserObject.shape,
		}),
	);
	const recreatedProperties = {
		...baseSchema.properties,
		system: zodMongoSchema(PSystemObject),
	};

	return { ...baseSchema, properties: recreatedProperties };
}

export function generateAlterSchema() {
	const baseSchema = zodMongoSchema(
		z.object({
			_id: z.unknown().meta({ bsonType: "objectId" }),
			...PAlterObject.shape
		}),
	);

	return baseSchema;
}

export function generateTagSchema() {
	const baseSchema = zodMongoSchema(
		z.object({
			_id: z.unknown().meta({ bsonType: "objectId" }),
			...PTagObject.shape,
		}),
	);

	return baseSchema;

}

type MongoType = "object" | "array" | "number" | "boolean" | "string" | "null";
type MongoBSONType =
	| "double"
	| "string"
	| "object"
	| "array"
	| "binData"
	| "objectId"
	| "bool"
	| "date"
	| "null"
	| "regex"
	| "javascript"
	| "int"
	| "long"
	| "decimal"
	| "number";
/**
 * MongoDB available keywords
 * @see https://www.mongodb.com/docs/manual/reference/operator/query/jsonSchema/#available-keywords
 */
export interface MongoSchema {
	additionalItems?: boolean | MongoSchema;
	additionalProperties?: boolean | MongoSchema;
	allOf?: MongoSchema[];
	anyOf?: MongoSchema[];
	bsonType?: MongoBSONType | MongoBSONType[];
	dependencies?: {
		[k: string]: string[] | MongoSchema;
	};
	description?: string;
	enum?: Array<
		| string
		| number
		| boolean
		| JSONSchema.ObjectSchema
		| JSONSchema.ArraySchema
		| null
	>;
	exclusiveMaximum?: boolean;
	exclusiveMinimum?: boolean;
	items?: MongoSchema | MongoSchema[];
	maximum?: number;
	maxItems?: number;
	maxLength?: number;
	maxProperties?: number;
	minimum?: number;
	minItems?: number;
	minLength?: number;
	minProperties?: number;
	multipleOf?: number;
	not?: MongoSchema;
	oneOf?: MongoSchema[];
	pattern?: string;
	patternProperties?: {
		[reg: string]: MongoSchema;
	};
	properties?: {
		[key: string]: MongoSchema;
	};
	required?: string[];
	title?: string;
	type?: MongoType | MongoType[];
	uniqueItems?: boolean;
}
