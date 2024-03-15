import { Status } from "../enums";
import { ApplicationAsset } from "../entities";
import { ApiError } from "../errors";

export class AssetsManagerService {

    public async getAllAssets(): Promise<ApplicationAsset[]> {
        const assets = await ApplicationAsset.find({
            where: {
                status: Status.ACTIVE
            }
        });
        return assets;
    }

    public async getByAssetId(assetId: string): Promise<ApplicationAsset> {
        const asset = await ApplicationAsset.findOne({
            where: {
                assetId: assetId,
                status: Status.ACTIVE
            }
        });
        return asset;
    }

    public async create(file: Express.Multer.File,
        description?: string,
        tags?: string[]): Promise<ApplicationAsset> {
        try {


            const appAsset = new ApplicationAsset()
            appAsset.assetId = file.filename;
            appAsset.filename = file.originalname;
            appAsset.mimetype = file.mimetype;
            appAsset.filesize = file.size;
            appAsset.destination = file.destination;
            appAsset.path = file.path;
            appAsset.description = description;
            appAsset.tags = tags;
            await appAsset.save();
            return appAsset;
        } catch (e) {
            throw new ApiError("Upload Asset Error", 500, e.message);
        }
    }

}