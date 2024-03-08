import { CollectionItemFilterOperations } from "../enums";

export interface ICollectionItems {
    count?: number;
    attributes?: ICollectionAttributes[];
    result: any[];
}

export interface ICollectionItemsQuery {
    properties?: string[];
    showAttributes?: boolean;
    limit?: number;
    offset?: number;
    sortByProperty?: string;
    ascending?: boolean;
    showCount?: boolean;
    filterByProperty?: string;
    filterValue?: string;
    filterOperation?: CollectionItemFilterOperations
}

export interface ICollectionAttributes {
    propertyName: string
    displayName: string
    type: string
}

export interface ICollectionFilterAttributes {
    filterByProperty: string
    filterValue: string
    operation: string
}