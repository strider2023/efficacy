import { CollectionProperty } from "../schemas";

export class Validator {

    public async validateRequest(request: any, property: CollectionProperty[]) {
        for (const rule of property) {
            if (rule.isRequired && !(rule.propertyName in request)) {
                return false;
            }
            if (!this.validateString(rule, request[rule.propertyName])) {
                return false;
            }
            if (!this.validateNumber(rule, request[rule.propertyName])) {
                return false;
            }
            if (!this.validateInteger(rule, request[rule.propertyName])) {
                return false;
            }
            if (!this.validateBoolean(rule, request[rule.propertyName])) {
                return false;
            }
            if (rule.type == 'array' && !(request[rule.propertyName] instanceof Array)) {
                return false;
            }
            if (rule.type == 'object' && !(typeof request[rule.propertyName] === "object")) {
                return false;
            }
        }
    }

    private validateString(property: CollectionProperty, value: string): boolean {
        if (property.type == 'string' && !(typeof value === "string")) {
            return false
        }
        return true;
    }

    private validateNumber(property: CollectionProperty, value: string): boolean {
        if (property.type == 'number' && !(typeof value === "number")) {
            return false
        }
        return true;
    }

    private validateInteger(property: CollectionProperty, value: string): boolean {
        if (property.type == 'integer' && !(typeof value === "number")) {
            return false
        }
        return true;
    }

    private validateBoolean(property: CollectionProperty, value: string): boolean {
        if (property.type == 'boolean' && !(typeof value === "boolean")) {
            return false
        }
        return true;
    }
}