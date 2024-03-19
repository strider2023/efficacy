import { Post, Route, Tags, Get, Request, Queries, UploadedFile, FormField, Middlewares, Security, Controller, Path, Delete } from "tsoa";
import { AssetsManagerService } from "../services";
import express from "express";
import { AppGetAll, AppQueryParams } from "../interfaces";
import { multerMiddleware } from "../config/multer-config";
import * as path from "path";
import * as fs from 'fs';
import { ApiError } from "../errors";

@Route("api/assets")
@Tags("Efficacy Assets Manager APIs")
export class AssetsManagerController extends Controller {

    @Get()
    @Security("jwt", ["admin"])
    public async getFiles(
        @Queries() queryParams: AppQueryParams
    ): Promise<AppGetAll> {
        return await new AssetsManagerService().getAll(queryParams);
    }

    @Post("upload")
    @Middlewares(multerMiddleware)
    public async uploadFile(
        @Request() request: express.Request,
        @FormField() path?: string,
        @FormField() description?: string,
        @FormField() tags?: string[],
        // @UploadedFile() file?: Express.Multer.File,
    ): Promise<void> {
        // console.log(request.file);
        await new AssetsManagerService().uploadFile(
            request.file,
            description,
            tags);
        return;
    }

    @Get("{assetId}")
    public async getFile(
        @Request() request: express.Request,
        @Path() assetId: string,
    ) {
        try {
            const assetDetails = await new AssetsManagerService().get(assetId, 'assetId');
            const filePath = path.join(__dirname, '../../', assetDetails.destination, assetDetails.assetId);
            request.res.status(200);
            request.res.setHeader('Content-disposition', 'attachment; filename=' + assetDetails.filename);
            request.res.setHeader('Content-type', assetDetails.mimetype);
            request.res.setHeader('Cache-Control', 'no-cache');
            const stream = fs.createReadStream(filePath);
            stream.pipe(request.res);
            await new Promise<void>((resolve, reject) => {
                stream.on('end', () => {
                    request.res.end();
                    resolve();
                })
            })
        } catch (e) {
            throw new ApiError("Download Asset error", 500, e.message);
        }
    }

    @Delete("{assetId}")
    public async deleteFile(
        @Path() assetId: string,
    ) {
        try {
            const assetDetails = await new AssetsManagerService().get(assetId, 'assetId');
            const filePath = path.join(__dirname, '../../', assetDetails.destination, assetDetails.assetId);
            fs.unlinkSync(filePath);
            await new AssetsManagerService().delete(assetId, 'assetId');
        } catch (e) {
            throw new ApiError("Download Asset error", 500, e.message);
        }
    }
}