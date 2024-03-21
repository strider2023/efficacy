import { CollectionProperty } from "../schemas";
import { ApiError } from "../errors";
import { BaseUIBuilder } from "./base-ui-builder.abstract";

export class WebUIBuilder extends BaseUIBuilder {

    public async getUIConfig(properties: CollectionProperty[]): Promise<any> {
        let jsonSchema = { type: "object", required: [], properties: {} };
        let uiSchema = null;
        try {
            for (const p of properties) {
                if (p.isRequired) {
                    jsonSchema.required.push(p.propertyName)
                }
                let jsonSchemaObj = {
                    type: this.jsonSchemType(p.type),
                    title: p.displayName
                };
                if (p.maximum) {
                    jsonSchemaObj['maxLength'] = p.maximum;
                }
                if (p.minimum) {
                    jsonSchemaObj['minLength'] = p.minimum;
                }
                if (p.type == 'string-enum') {
                    jsonSchemaObj['enum'] = p.enumValues;
                }
                jsonSchema.properties[p.propertyName] = { ...jsonSchemaObj };
            }
            return { jsonSchema, uiSchema };
        } catch (e) {
            throw new ApiError("Page Config Error", 204, e.message);
        }
    }

    // 'json',
    // 'object',
    // 'array',
    // 'asset',
    // 'hash'
    private jsonSchemType(type: string): string {
        if (type == 'integer' || type == 'big-integer') {
            return 'integer';
        }
        if (type == 'float' || type == 'decimal') {
            return 'number';
        }
        if (type == 'string' || type == 'string-enum' || type == 'text') {
            return 'string';
        }
        if (type == 'timestamp') {
            return 'time';
        }
        return type;
    }
}