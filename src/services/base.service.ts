import { AppGetAll, AppQueryParams } from "../interfaces";
import { FilterOperations, Status } from "../enums";
import { getDatabaseAdapter } from "../database/knex-config";
import { ApiError } from "../errors";
import { RedisClient } from "../config/redis-config";
import { RedisClientType } from "redis";
import { TABLE_ACTIVITY } from "../constants/tables.constants";

export abstract class BaseService<BaseSchema> {

    readonly tableName: string;
    readonly entityName: string;
    readonly schema: BaseSchema;
    readonly cache: RedisClientType;
    readonly db: any;

    constructor(tableName: string, entityName: string) {
        this.tableName = tableName;
        this.entityName = entityName;
        this.cache = RedisClient.getInstance().getClient();
        this.db = getDatabaseAdapter();
    }

    public async getAll(queryParams: AppQueryParams, status?: Status): Promise<AppGetAll> {
        const response: AppGetAll = {
            result: []
        }
        try {
            const query = this.db.from(this.tableName)
            if (status) {
                query.where('status', status)
            }
            if (queryParams.properties) {
                query.select(queryParams.properties);
            }
            if (queryParams.offset) {
                query.offset(queryParams.offset);
            }
            if (queryParams.limit) {
                query.limit(queryParams.limit);
            }
            if (queryParams.sortByProperty) {
                query.orderBy(queryParams.sortByProperty, queryParams.ascending ? 'asc' : 'desc');
            }
            if (queryParams.filterByProperty && queryParams.filterValue && queryParams.filterOperation) {
                if (queryParams.filterOperation === FilterOperations.LIKE) {
                    query.where(queryParams.filterByProperty, queryParams.filterOperation, `%${queryParams.filterValue.replaceAll('%', '\\%')}%`);
                } else {
                    query.where(queryParams.filterByProperty, queryParams.filterOperation, queryParams.filterValue);
                }
            }
            response.result = await query;
            if (queryParams.showCount) {
                response.count = await getDatabaseAdapter().from(this.tableName).count('id');
            }
            return response
        } catch (e) {
            throw new ApiError(`Error fetching all from ${this.entityName}`, 500, e.message);
        }
    }

    public async get(value: any, key: string = 'id'): Promise<BaseSchema> {
        try {
            const response = await this.db.from(this.tableName)
                .where(key, value)
                .where('status', Status.ACTIVE)
                .first();
            return response;
        } catch (e) {
            throw new ApiError(`Error fetching entry from ${this.entityName}`, 500, e.message);
        }
    };

    public async create(request: Record<string, any>): Promise<string> {
        try {
            return await this.db.into(this.tableName)
                .insert(request)
                .returning('id');
        } catch (e) {
            throw new ApiError(`Error creating entry for ${this.entityName}`, 500, e.message);
        }
    };

    public async update(request: Record<string, any>, value: any, key: string = 'id') {
        try {
            await this.db.into(this.tableName)
                .where(key, value)
                .update(request);
        } catch (e) {
            throw new ApiError(`Error updating entry for ${this.entityName}`, 500, e.message);
        }
    };

    public async delete(value: string, key: string = 'id') {
        try {
            await this.db.into(this.tableName)
                .where(key, value)
                .update({ status: Status.DELETED });
        } catch (e) {
            throw new ApiError(`Error removing from ${this.entityName}`, 500, e.message);
        }
    };

    private async createActivityEntry(action: string, id: string) {
        await this.db.into(TABLE_ACTIVITY)
            .insert({
                action: action,
                tableName: this.tableName,
                objectId: id
            });
    }
}