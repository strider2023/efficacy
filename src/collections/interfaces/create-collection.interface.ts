import { MedataProperty } from "./metadata-property.interface"

export interface CreateCollection {
    name: string
    description?: string
    application: string
    properties: MedataProperty[]
}