import { CollectionItemFilterOperations } from "../enums";

export interface AppResponse {
    status: number;
    message: string;
}

export interface AppQueryParams {
    properties?: string[];
    limit?: number;
    offset?: number;
    sortByProperty?: string;
    ascending?: boolean;
    showCount?: boolean;
    filterByProperty?: string;
    filterValue?: string;
    filterOperation?: CollectionItemFilterOperations
}

export interface AppGetAll {
    count?: number;
    result: any[];
}
