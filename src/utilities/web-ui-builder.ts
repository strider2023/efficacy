import { ApiError } from "../errors";
import { BaseUIBuilder } from "./base-ui-builder.abstract";

export class WebUIBuilder extends BaseUIBuilder {

    public async getUIConfig(properties: any[]): Promise<any> {
        let jsonSchema = { type: "object", required: [], properties: {} };
        let uiSchema = {};
        try {
            for (const p of properties) {
                if (p.required) {
                    jsonSchema.required.push(p.propertyName)
                }
                let jsonSchemaObj = {
                    type: p.type == 'date' ? "string" : p.type,
                    title: p.displayName
                };
                if (p.maximum) {
                    jsonSchemaObj['maxLength'] = p.maximum;
                }
                if (p.minimum) {
                    jsonSchemaObj['minLength'] = p.minimum;
                }
                if (p.isEnum) {
                    jsonSchemaObj['enum'] = p.enumValues;
                }
                jsonSchema.properties[p.propertyName] = { ...jsonSchemaObj };

                if (p.viewProperty) {
                    let uiSchemaObj = {};
                    const uiOptions = { "ui:options": {} };
                    if (p.viewProperty.widget) {
                        uiSchemaObj['ui:widget'] = p.viewProperty.widget;
                    }
                    if (p.viewProperty.inputType) {
                        uiOptions["ui:options"]['inputType'] = p.viewProperty.inputType;
                    }
                    uiSchemaObj = { ...uiOptions };
                    uiSchema[p.propertyName] = { ...uiSchemaObj }
                }
            }
            return { jsonSchema, uiSchema };
        } catch (e) {
            throw new ApiError("Page Config Error", 204, e.message);
        }
    }
}