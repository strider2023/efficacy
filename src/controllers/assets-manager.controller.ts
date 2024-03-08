import { Post, Route, Tags, Get, Request, Queries } from "tsoa";
import { AssetsManagerService } from "../services";
import { ApplicationAsset } from "../entities";
import express from "express";
import { IAppQueryParams } from "../interfaces";

@Route("api/assets")
@Tags("Efficacy Assets Manager APIs")
export class AssetsManagerController {

    @Get()
    public async getFiles(
        @Queries() queryParams: IAppQueryParams
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