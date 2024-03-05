import { Status } from "../common/enums";
import { Application } from "../application/application.entity";
import { ApplicationAsset } from "./assets-manager.entity";

export class AssetsManagerService {

    public async getAllAssetsByApplication(appName: string): Promise<ApplicationAsset[]> {
        const app = await Application.findOneBy({ name: appName });
        const assets = await ApplicationAsset.find({
            where: {
                application: app,
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
        appName: string,
        description?: string,
        tags?: string[]): Promise<ApplicationAsset> {
        const app = await Application.findOneBy({ name: appName });
        const appAsset = new ApplicationAsset()
        appAsset.assetId = Date.now() + '-' + Math.round(Math.random() * 1E9);
        appAsset.filename = file.originalname;
        appAsset.mimetype = file.mimetype;
        appAsset.filesize = file.size;
        appAsset.description = description;
        appAsset.tags = tags;
        appAsset.application = app;
        await appAsset.save();
        return appAsset;
    }

}