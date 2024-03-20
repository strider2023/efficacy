import { BaseSchema } from "./base.schema";

export interface Activity extends BaseSchema {
    action: string;
    tableName: string;
    objectId: string;
    userId?: string;
    isSystem?: boolean;
    ip?: string;
    revision?: number;
}