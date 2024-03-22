import { Body, Controller, Get, Path, Post, Queries, Route, Security, Tags, SuccessResponse, Delete, Put, Request } from "tsoa";
import { CollectionPropertiesService } from "../services";
import { AppQueryParams, AppGetAll, CreateCollectionProperty, UpdateCollectionProperty } from "../interfaces";
import { CollectionProperty } from "../schemas";
import { Status } from "../enums";

@Route("api/collection/{collectionId}/property")
@Tags("Efficacy Collection Properties APIs")
export class CollectionPropertiesController extends Controller {

    @Get()
    public async getAll(
        @Path() collectionId: string,
        @Queries() queryParams: AppQueryParams
    ): Promise<AppGetAll> {
        return new CollectionPropertiesService(null).getAll(queryParams, Status.ACTIVE);
    }

    @Get("{propertyName}")
    public async get(
        @Path() collectionId: string,
        @Path() propertyName: string,
    ): Promise<CollectionProperty> {
        return new CollectionPropertiesService(null).get(propertyName);
    }

    @Get("{platform}/template")
    public async getViewProperties(
        @Path() collectionId: string,
        @Path() platform: string,
    ): Promise<any> {
        return new CollectionPropertiesService(null).getUIProperties(collectionId, platform);
    }

    @SuccessResponse("201", "Created")
    @Post("multiple")
    @Security("jwt")
    public async createMultiple(
        @Request() req: any,
        @Path() collectionId: string,
        @Body() request: CreateCollectionProperty[]
    ): Promise<void> {
        this.setStatus(201)
        await new CollectionPropertiesService(req.user.email).createProperties(request);
        return;
    }

    @SuccessResponse("201", "Created")
    @Post()
    @Security("jwt")
    public async create(
        @Request() req: any,
        @Path() collectionId: string,
        @Body() request: CreateCollectionProperty
    ): Promise<void> {
        this.setStatus(201)
        await new CollectionPropertiesService(req.user.email).createProperty(request);
        return;
    }


    @SuccessResponse("200", "Updated")
    @Put("{propertyName}")
    @Security("jwt")
    public async update(
        @Request() req: any,
        @Path() collectionId: string,
        @Path() propertyName: string,
        @Body() request: UpdateCollectionProperty
    ): Promise<void> {
        await new CollectionPropertiesService(req.user.email).updateProperty(collectionId, request, propertyName);
        return;
    }

    @SuccessResponse("200", "Deleted")
    @Delete("{propertyName}")
    @Security("jwt")
    public async delete(
        @Request() req: any,
        @Path() collectionId: string,
        @Path() propertyName: string,
    ): Promise<void> {
        await new CollectionPropertiesService(req.user.email).deleteProperty(collectionId, propertyName);
        return;
    }
}