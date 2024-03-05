import { MedataProperty } from "./metadata-property.interface"

export interface CreateCollection {
    application: string
    name: string
    properties: MedataProperty[]
    description?: string
    schemaName?: string
}