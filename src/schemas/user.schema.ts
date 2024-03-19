import { AccessGroup } from "./access-group.schema"
import { BaseSchema } from "./base.schema"

export interface User extends BaseSchema {
    firstname: string
    middlename?: string
    lastname: string
    phone: string
    email: string
    password: string
    dob?: Date
    image?: string
    role?: string
    accessGroup?: AccessGroup[]
}