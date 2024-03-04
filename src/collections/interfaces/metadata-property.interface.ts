export interface MedataProperty {
    propertyName: string
    description?: string
    propertyType: string
    parent?: MedataProperty
    children?: MedataProperty[]
    required: boolean
    default?: string;
    maximum?: number;
    minimum?: number;
    pattern?: string;
    isEnum?: boolean;
    enumValues?: string[];
}