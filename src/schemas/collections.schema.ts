import { BaseSchema } from "./base.schema";

export interface Collections extends BaseSchema {
    collectionId: string;
    displayName: string;
    description?: string;
    schemaName: string;
    tableName: string;
    version: number;
    isLatest: boolean;
    permissions?: string[];
}