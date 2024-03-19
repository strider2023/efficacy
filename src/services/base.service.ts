import { AppGetAll, AppQueryParams } from "../interfaces";
import { CollectionItemFilterOperations, Status } from "../enums";
import { getDatabaseAdapter } from "../database/knex-config";
import { ApiError } from "../errors";
import { RedisClient } from "../config/redis-config";

export abstract class BaseService<BaseSchema> {

    tableName = null;
    entityName = '';
    schema: BaseSchema;
    cache = null;
    db = null;

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
            const query = await getDatabaseAdapter()
                .from(this.tableName)
            if (status) {
                query.where('status', Status.ACTIVE)
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
                if (queryParams.filterOperation === CollectionItemFilterOperations.LIKE) {
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
            const response = await getDatabaseAdapter()
                .from(this.tableName)
                .where(key, value)
                .where('status', Status.ACTIVE)
                .first();
            return response;
        } catch (e) {
            throw new ApiError(`Error fetching entry from ${this.entityName}`, 500, e.message);
        }
    };

    public async create(request: Record<string, any>) {
        try {
            await getDatabaseAdapter()
                .into(this.tableName)
                .insert(request);
        } catch (e) {
            throw new ApiError(`Error creating entry for ${this.entityName}`, 500, e.message);
        }
    };

    public async update(request: Record<string, any>, value: any, key: string = 'id') {
        try {
            await getDatabaseAdapter()
                .into(this.tableName)
                .where(key, value)
                .update(request);
        } catch (e) {
            throw new ApiError(`Error updating entry for ${this.entityName}`, 500, e.message);
        }
    };

    public async delete(value: string, key: string = 'id') {
        try {
            await getDatabaseAdapter()
                .into(this.tableName)
                .where(key, value)
                .update({ status: Status.DELETED });
        } catch (e) {
            throw new ApiError(`Error removing from ${this.entityName}`, 500, e.message);
        }
    };
}