import { 
    createAssetsTable, 
    createActivityTable, 
    createCollectionPropertiesTable, 
    createCollectionsTable, 
    createRolesTable, 
    createUserTable 
} from "../schemas";
import { getDatabaseAdapter } from "./knex-config";

export async function migrate() {

    await getDatabaseAdapter().raw('CREATE SCHEMA IF NOT EXISTS efficacy;');

    await createAssetsTable();
    await createRolesTable();
    await createUserTable();
    await createActivityTable();
    await createCollectionsTable();
    await createCollectionPropertiesTable();

    // getDatabaseAdapter().schema.withSchema('efficacy').hasTable('efficacy_collection_views').then((exists) => {
    //     if (!exists) {
    //         return getDatabaseAdapter().schema.withSchema('efficacy').createTable('efficacy_collection_views', function (t) {
    //             t.uuid('id', { primaryKey: true }).defaultTo(getDatabaseAdapter().raw("uuid_generate_v4()"));
    //             t.string('collectionId', 100).notNullable();
    //             t.string('viewName', 100).notNullable();
    //             t.string('displayName', 100).notNullable();
    //             t.string('description').nullable();
    //             t.enu('type', SYSTEM_COLLECTION_VIEW_TYPES).notNullable();
    //             t.integer('version').notNullable();
    //             t.boolean('isLatest').notNullable();
    //             t.json('additionalMetadata').nullable();
    //             t.enu('status', ['active', 'deleted', 'archived', 'inactive']);
    //             t.timestamps({ useCamelCase: true, useTimestamps: true, defaultToNow: true });

    //             t.foreign('collectionId').references('collectionId').inTable('efficacy.efficacy_collections');
    //         });
    //     }
    // });
}