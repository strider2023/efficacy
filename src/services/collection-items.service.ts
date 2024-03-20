import { BaseService } from "./base.service";
import { CollectionProperty } from "../schemas";
import { TABLE_COLLECTION_PROPERTIES } from "../constants/tables.constants";

export class CollectionItemsService extends BaseService<CollectionProperty> {
    
    constructor() {
        super(TABLE_COLLECTION_PROPERTIES, 'Collection Properties')
    }
}