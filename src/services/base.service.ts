import { AppGetAll, AppQueryParams } from "../interfaces";
import { ActivityTypes, FilterOperations, Status } from "../enums";
import { getDatabaseAdapter } from "../database/knex-config";
import { ApiError } from "../errors";
import { RedisClient } from "../config/redis-config";
import { RedisClientType } from "redis";
import { TABLE_ACTIVITY } from "../constants/tables.constants";
import * as _ from "lodash";

export abstract class BaseService<BaseSchema> {

    readonly tableName: string;
    readonly entityName: string;
    readonly schema: BaseSchema;
    readonly cache: RedisClientType;
    readonly db: any;
    readonly userEmail!: string;

    constructor(tableName: string, entityName: string, email?: string) {
        this.tableName = tableName;
        this.entityName = entityName;
        this.cache = RedisClient.getInstance().getClient();
        this.db = getDatabaseAdapter();
        this.userEmail = email;
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

    public async get(value: any, key: string = 'id', status: Status = Status.ACTIVE): Promise<BaseSchema> {
        try {
            const resp = await this.db.from(this.tableName)
                .where(key, value)
                .where('status', status)
                .first();
            if (!resp) {
                return null;
            }
            return _.omit(resp, ['createdAt', 'updatedAt']);
        } catch (e) {
            throw new ApiError(`Error fetching entry from ${this.entityName}`, 500, e.message);
        }
    };

    public async create(request: Record<string, any>, keys: string[] = ['id']): Promise<any> {
        try {
            const resp = await this.db.into(this.tableName)
                .returning(keys)
                .insert(request);
            // Capture activity changes
            this.createActivityEntry(ActivityTypes.CREATE, resp[0][keys[0]]);
            console.log(resp[0]);
            return resp[0];
        } catch (e) {
            throw new ApiError(`Error creating entry for ${this.entityName}`, 500, e.message);
        }
    };

    public async update(request: Record<string, any>, value: any, key: string = 'id') {
        try {
            let existingValue = await this.get(value, key);
            let updateValue = _.merge({}, existingValue, request);
            // console.log(existingValue, updateValue);
            // Get changes
            const difference = _.pickBy(updateValue, (v, k) => !_.isEqual(existingValue[k], v));
            // Update table
            if (!_.isEmpty(difference)) {
                const resp = await this.db.into(this.tableName)
                    .returning(['id'])
                    .where(key, value)
                    .update(request);
                // Capture activity changes
                this.createActivityEntry(ActivityTypes.UPDATE, resp[0]['id'], difference);
            } else {
                console.info("No change detected.");
            }
        } catch (e) {
            throw new ApiError(`Error updating entry for ${this.entityName}`, 500, e.message);
        }
    };

    public async delete(value: string, key: string = 'id') {
        try {
            const resp = await this.db.into(this.tableName)
                .returning(['id'])
                .where(key, value)
                .update({ status: Status.DELETED });
            // Capture activity changes
            this.createActivityEntry(ActivityTypes.DELETE, resp[0]['id']);
        } catch (e) {
            throw new ApiError(`Error removing from ${this.entityName}`, 500, e.message);
        }
    };

    protected async createActivityEntry(
        action: ActivityTypes,
        id: string,
        changes?: Record<string, any>,
        tableName?: string,
        isSystem?: boolean) {
        await this.db.into(TABLE_ACTIVITY)
            .insert({
                action: action,
                tableName: tableName || this.tableName,
                objectId: id,
                changes: changes,
                isSystem: isSystem,
                userId: this.userEmail
            });
    }
}