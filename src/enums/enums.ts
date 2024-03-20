export enum Status {
    ACTIVE = 'active',
    DELETED = 'deleted',
    ARCHIVED = 'archived',
    INACTIVE = 'inactive'
}

export enum PropertyTypes {
    STRING = 'string',
    TEXT = 'text',
    BOOLEAN = 'boolean',
    INTEGER = 'integer',
    BIG_INTEGER = 'big-integer',
    FLOAT = 'float',
    DECIMAL = 'decimal',
    TIMESTAMP = 'timestamp',
    DATE_TIME = 'date-time',
    DATE = 'date',
    TIME = 'time',
    JSON = 'json',
    OBJECT = 'object',
    ARRAY = 'array',
    ASSETS = 'asset',
    STRING_ENUM = 'string-enum',
    HASH = 'hash'
}

export enum FilterOperations {
    LIKE = 'like',
    EQUALS = '=',
    NOT_EQUALS = '!=',
}
