import { FilterOperations } from "../enums";

export interface CollectionItems {
    count?: number;
    attributes?: CollectionAttributes[];
    result: any[];
}

export interface CollectionItemsQuery {
    properties?: string[];
    showAttributes?: boolean;
    limit?: number;
    offset?: number;
    sortByProperty?: string;
    ascending?: boolean;
    showCount?: boolean;
    filterByProperty?: string;
    filterValue?: string;
    filterOperation?: FilterOperations
}

export interface CollectionAttributes {
    propertyName: string
    displayName: string
    type: string
}

export interface CollectionFilterAttributes {
    filterByProperty: string
    filterValue: string
    operation: string
}