import { Status } from "../common/enums";
import { Application } from "../application/application.entity";
import { ApplicationAsset } from "./assets-manager.entity";

export class AssetsManagerService {

    public async getAll(): Promise<Application[]> {
        const applications = await Application.find({
            where: {
                status: Status.ACTIVE
            }
        });
        return applications;
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