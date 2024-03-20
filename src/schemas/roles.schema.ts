import { BaseSchema } from "./base.schema"

export interface Roles extends BaseSchema {
    roleId: string
    displayName: string
    description?: string
    adminAccess?: boolean
    portalAccess?: boolean
    appAccess?: boolean
}