import { TABLE_ASSETS } from "../constants/tables.constants";
import { ApiError } from "../errors";
import { BaseService } from "./base.service";
import { Assets } from "../schemas";

export class AssetsManagerService extends BaseService<Assets>{

    constructor(email: string) {
        super(TABLE_ASSETS, 'Assets', email)
    }

    public async uploadFile(file: Express.Multer.File,
        description?: string,
        tags?: string[]): Promise<any>{
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
            return await this.db
                .into(this.tableName)
                .returning('assetId')
                .insert(request);
        } catch (e) {
            throw new ApiError(`Error creating entry for ${this.entityName}`, 500, e.message);
        }
    }
}