export interface CreateActivity {
    action: string;
    tableName: string;
    objectId: string;
    userId?: string;
    isSystem?: boolean;
    ip?: string;
}