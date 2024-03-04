import { Post, Route, Tags, Path, Get, Middlewares, Request } from "tsoa";
import { AssetsManagerService } from "./assets-manager.service";
import { ApplicationAsset } from "./assets-manager.entity";
import { multerMiddleware } from "../multer-config";
import express from "express";


@Route("api/assets")
@Tags("Efficacy Assets Manager APIs")
export class AssetsManagerController {

    @Post("upload")
    @Middlewares(multerMiddleware)
    public async uploadFile(
        @Request() request: express.Request
    ): Promise<ApplicationAsset> {
        // @UploadedFile() file: Express.Multer.File,
        // @FormField() appName: string,
        // @FormField() description?: string,
        // @FormField() tags?: string[],
        // console.log(request.file, request.body.appName, request.body.description, request.body.tags);
        return new AssetsManagerService().create(
            request.file, 
            request.body.appName, 
            request.body.description, 
            request.body.tags);
    }

    @Get("{assetId}")
    public async getFile(
        @Path() assetId: string,
    ): Promise<void> {
        console.log(assetId);
    }
}