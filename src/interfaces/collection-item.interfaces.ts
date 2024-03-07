export interface ICollectionItems {
    count: number;
    data: any[];
}

export interface ICollectionQueryParams {
    sort?: string;
    page?: number;
}

export interface ICollectionItemQuery {
    showCount?: boolean
    selectedProperties?: string[]
}