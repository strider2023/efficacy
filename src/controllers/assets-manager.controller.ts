import { Post, Route, Tags, Get, Request, Queries, UploadedFile, FormField, Middlewares, Security } from "tsoa";
import { AssetsManagerService } from "../services";
import { ApplicationAsset } from "../entities";
import express from "express";
import { IAppQueryParams } from "../interfaces";
import { multerMiddleware } from "../config/multer-config";

@Route("api/assets")
@Tags("Efficacy Assets Manager APIs")
export class AssetsManagerController {

    @Get()
    @Security("jwt", ["admin"])
    public async getFiles(
        @Queries() queryParams: IAppQueryParams
    ): Promise<ApplicationAsset[]> {
        return await new AssetsManagerService().getAllAssets();
    }

    @Post("upload")
    @Middlewares(multerMiddleware)
    public async uploadFile(
        @Request() request: express.Request,
        @FormField() description?: string,
        @FormField() tags?: string[],
        // @UploadedFile() file?: Express.Multer.File,
    ): Promise<ApplicationAsset> {
        console.log('tets')
        return await new AssetsManagerService().create(
            request.file,
            description,
            tags);

    }
}