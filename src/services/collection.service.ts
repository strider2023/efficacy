import { SchemaBuilder } from "../utilities";
import { BaseService } from "./base.service";
import { Collections } from "../schemas";
import { TABLE_COLLECTIONS } from "../constants/tables.constants";

export class CollectionService extends BaseService<Collections> {

    constructor() {
        super(TABLE_COLLECTIONS, 'Collections')
    }

    public async syncCollections() {
        new SchemaBuilder().syncTables();
    }
}