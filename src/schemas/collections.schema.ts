import { BaseSchema } from "./base.schema";

export interface Collections extends BaseSchema {
    collectionId: string
    displayName: string
    description?: string
    schemaName: string
    tableName: string
    permissions?: string[]
    isPublic?: boolean
    useTimestamps?: boolean
    additionalMetadata?: Record<string, any>
}