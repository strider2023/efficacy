export interface ICollection {
    collectionId: string
    displayName: string
    schemaName?: string
    tableName: string
    properties: IMetadataProperty[]
    accessType?: string
    description?: string
}

export interface IMetadataProperty {
    propertyName: string
    displayName: string
    type: string
    required: boolean
    parent?: IMetadataProperty
    children?: IMetadataProperty[]
    arrayOptions?: IArrayViewProperty
    description?: string
    default?: string;
    isUnique?: boolean;
    maximum?: number;
    minimum?: number;
    pattern?: string;
    isEnum?: boolean;
    enumValues?: string[];
    viewProperty?: IMetadataViewProperty;
}

export interface IMetadataViewProperty {
    widget: string
    inputType?: string
    autocomplete?: string
    autofocus?: boolean
    disabled?: boolean
    readonly?: boolean
    enumDisabled?: string[]
    filePreview?: boolean
    helpText?: string
    hideError?: boolean
    placeholder?: string
    acceptedFileExtendsions?: string[]
    rows?: number
    yearsRangeStart?: number
    yearRangeEnd?: number
    format?: string
}

export interface IArrayViewProperty {
    orderable?: boolean
    addable?: boolean
    copyable?: boolean
    removable?: boolean
}