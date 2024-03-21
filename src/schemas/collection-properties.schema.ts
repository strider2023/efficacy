import { BaseSchema } from "./base.schema";

export interface CollectionProperty extends BaseSchema {
    collectionId: string
    propertyName: string
    displayName: string
    description?: string
    type: string
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
    version: number;
    isLatest: boolean;
    additionalMetadata?: Record<string, any>
}