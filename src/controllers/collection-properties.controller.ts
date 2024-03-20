import { Body, Controller, Get, Path, Post, Queries, Route, Security, Tags, SuccessResponse, Delete, Put } from "tsoa";
import { CollectionPropertiesService } from "../services";
import { AppQueryParams, AppGetAll, CreateCollectionProperty, UpdateCollectionProperty } from "../interfaces";
import { CollectionProperty } from "../schemas";
import { Status } from "../enums";

@Route("api/collection/property")
@Tags("Efficacy Collection Properties APIs")
export class CollectionPropertiesController extends Controller {

    @Get()
    public async getAll(
        @Queries() queryParams: AppQueryParams
    ): Promise<AppGetAll> {
        return new CollectionPropertiesService().getAll(queryParams, Status.ACTIVE);
    }

    @Get("{propertyName}")
    public async get(
        @Path() propertyName: string,
    ): Promise<CollectionProperty> {
        return new CollectionPropertiesService().get(propertyName);
    }

    @SuccessResponse("201", "Created")
    @Post("multiple")
    @Security("jwt")
    public async createMultiple(
        @Body() request: CreateCollectionProperty[]
    ): Promise<void> {
        this.setStatus(201)
        await new CollectionPropertiesService().createProperties(request);
        return;
    }

    @SuccessResponse("201", "Created")
    @Post()
    @Security("jwt")
    public async create(
        @Body() request: CreateCollectionProperty
    ): Promise<void> {
        this.setStatus(201)
        await new CollectionPropertiesService().createProperty(request);
        return;
    }


    @SuccessResponse("200", "Updated")
    @Put("{propertyName}")
    @Security("jwt")
    public async update(
        @Path() propertyName: string,
        @Body() request: UpdateCollectionProperty
    ): Promise<void> {
        await new CollectionPropertiesService().update(request, propertyName, 'propertyName');
        return;
    }

    @SuccessResponse("200", "Deleted")
    @Delete("{propertyName}")
    @Security("jwt")
    public async delete(
        @Path() propertyName: string,
    ): Promise<void> {
        await new CollectionPropertiesService().deleteProperty(propertyName);
        return;
    }
}