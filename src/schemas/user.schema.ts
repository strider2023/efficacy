import { BaseSchema } from "./base.schema"

export interface User extends BaseSchema {
    firstname: string
    middlename?: string
    lastname: string
    phone: string
    email: string
    password: string
    roleId: string
    dob?: Date
    image?: string
    location?: string
    description?: string
    tags?: string[]
    additionalMetadata?: Record<string, any>
}