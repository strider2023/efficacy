export interface IAppResponse {
    status: number;
    message: string;
}

export interface IAppQueryParams {
    properties?: string[];
    limit?: number;
    offset?: number;
    sortByProperty?: string;
    ascending?: boolean;
    showCount?: boolean;
    filterByProperty?: string;
    filterValue?: string;
}
