import { Status } from "../enums";
import { ApplicationAsset } from "../entities";

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
        const appAsset = new ApplicationAsset()
        appAsset.assetId = Date.now() + '-' + Math.round(Math.random() * 1E9);
        appAsset.filename = file.originalname;
        appAsset.mimetype = file.mimetype;
        appAsset.filesize = file.size;
        appAsset.description = description;
        appAsset.tags = tags;
        await appAsset.save();
        return appAsset;
    }

}