import { TABLE_ASSETS } from "../constants/tables.constants";
import { ApiError } from "../errors";
import { BaseService } from "./base.service";
import { Assets } from "../schemas";

export class AssetsManagerService extends BaseService<Assets>{

    constructor() {
        super(TABLE_ASSETS, 'Assets')
    }

    public async uploadFile(file: Express.Multer.File,
        description?: string,
        tags?: string[]) {
        try {
            const request = {
                assetId: file.filename,
                filename: file.originalname,
                mimetype: file.mimetype,
                filesize: file.size,
                destination: file.destination,
                path: file.path,
                description: description,
                tags: tags
            }
            await this.db
                .into(this.tableName)
                .insert(request);
        } catch (e) {
            throw new ApiError(`Error creating entry for ${this.entityName}`, 500, e.message);
        }
    }
}