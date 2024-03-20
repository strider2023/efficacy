import { PropertyTypes } from "../enums"

export interface CreateCollectionProperty {
    collectionId: string
    propertyName: string
    displayName: string
    description?: string
    type: PropertyTypes
    isRequired: boolean
    isUnique?: boolean
    default?: string
    regex?: string
    stringOneOf?: string[];
    stringNoneOf?: string[];
    stringLengthCheckOperator?: string
    stringLengthCheck?: boolean
    setNumberPositive?: boolean
    setNumberNegative?: boolean
    minimum?: number
    maximum?: number
    checkNumberRange?: boolean
    numericPrecision?: number
    numericScale?: number
    enumValues?: string[]
    dateFormat?: string
    foreignKeyColumn?: string
    foreignKeySchema?: string
    foreignKeyTable?: string
    additionalMetadata?: Record<string, any>
}

export interface UpdateCollectionProperty {
    displayName: string
    description?: string
    type: string
    isRequired: boolean
    isUnique: boolean
    default?: string
    regex?: string
    stringOneOf?: string[];
    stringNoneOf?: string[];
    stringLengthCheckOperator?: string
    stringLengthCheck?: boolean
    setNumberPositive?: boolean
    setNumberNegative?: boolean
    minimum?: number
    maximum?: number
    checkNumberRange?: boolean
    numericPrecision?: number
    numericScale?: number
    isEnum?: boolean
    enumValues?: string[]
    dateFormat?: string
    foreignKeyColumn?: string
    foreignKeySchema?: string
    foreignKeyTable?: string
    additionalMetadata?: Record<string, any>
}