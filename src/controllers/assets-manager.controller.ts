import { Post, Route, Tags, Path, Get, Request } from "tsoa";
import { AssetsManagerService } from "../services/assets-manager.service";
import { ApplicationAsset } from "../entities/assets-manager.entity";
import express from "express";

@Route("api/assets")
@Tags("Efficacy Assets Manager APIs")
export class AssetsManagerController {

    @Get()
    public async getFilesByApplication(
    ): Promise<ApplicationAsset[]> {
        return new AssetsManagerService().getAllAssetsByApplication();
    }

    @Post("upload")
    // @Middlewares(multerMiddleware)
    public async uploadFile(
        @Request() request: express.Request,
        // @UploadedFile() file: Express.Multer.File,
        // @FormField() appName: string,
        // @FormField() description?: string,
        // @FormField() tags?: string[],
    ): Promise<ApplicationAsset> {
        return new AssetsManagerService().create(
            request.file,
            request.body.description,
            request.body.tags);
    }
}