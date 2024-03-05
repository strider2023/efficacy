export enum UserRole {
    ADMIN = "admin",
    EDITOR = "editor",
    USER = "user",
}

export enum ApplicationAccessType {
    PRIVATE = "private",
    RESTRICTED = "restricted",
    PUBLIC = "public",
}

export enum Status {
    ACTIVE = "active",
    DELETED = "deleted",
}

export enum PropertyTypes {
    FLOAT = 'float',
    INTEGER = 'integer',
    STRING = 'string',
    BOOLEAN = 'boolean',
    ARRAY = 'array',
    OBJECT = 'object',
    ASSET = 'asset',
    DATE = 'date',
    DATETIME = 'datetime',
}
