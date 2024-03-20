export interface CreateCollection {
    collectionId: string;
    displayName: string;
    description?: string;
    schemaName?: string;
    tableName: string;
    permissions?: string[];
    useTimestamps?: boolean;
}

export interface UpdateCollection {
    displayName?: string;
    description?: string;
    permissions?: string[];
}