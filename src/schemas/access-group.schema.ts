import { BaseSchema } from "./base.schema"

export interface AccessGroup extends BaseSchema {
    accessGroupId: string
    displayName: string
    description?: string
}