export interface CreateActivity {
    action: string;
    tableName: string;
    objectId: string;
    changes?: Record<string, any>;
    userId?: string;
    isSystem?: boolean;
    ip?: string;
}