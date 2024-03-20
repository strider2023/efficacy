export enum UserRole {
    ADMIN = "admin",
    EDITOR = "editor",
    USER = "user",
}

export enum CollectionAccessType {
    PRIVATE = "private",
    RESTRICTED = "restricted",
    PUBLIC = "public",
}

export enum UserTypes {
    ADMIN = "admin",
    PORTAL_USER = "portal_user",
    APP_USER = "app_user",
}

export enum Status {
    ACTIVE = 'active',
    DELETED = 'deleted',
    ARCHIVED = 'archived',
    INACTIVE = 'inactive'
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

export enum WidgetTypes {
    TEXT = 'text',
    RADIO = 'radio',
    SELECT = 'select',
    COLOR = 'color',
    TEXTAREA = 'textarea',
    UPDOWN = 'updown',
    RANGE = 'range',
    HIDDEN = 'hidden',
    ALT_DATETIME = 'alt-datetime',
    ALT_DATE = 'alt-date'
}

export enum InputTypes {
    EMAIL = 'email',
    URI = 'uri',
    DATA_URL = 'data-url',
    DATE = 'date',
    DATE_TIME = 'date-time',
    TIME = 'time'
}

export enum DateFormats {
    DATE_MONTH_YEAR = 'DMY',
    MONTH_DATE_YEAR = 'MDY',
}

export enum FilterOperations {
    LIKE = 'like',
    EQUALS = '=',
    NOT_EQUALS = '!=',
}

// {
//     boolean : ['hidden', 'radio', 'select'],
//     string: ['hidden', 'text', 'textarea', 'password', 'color', 'email', 'uri', 'data-url'],
//     date: ['date'],
//     dateTime: ['date-time'],
//     time: ['time']
//     number: ['hidden', 'number', 'updown', 'range', 'radio'],
//     file: ['file']
// }
