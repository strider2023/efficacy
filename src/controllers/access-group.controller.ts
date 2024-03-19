import { Post, Route, Tags, Get, Put, Delete, Path, Body, Queries, Security, Controller, SuccessResponse } from "tsoa";
import { AccessGroupService } from "../services";
import { CreateAccessGroup, AppQueryParams, UpdateAccessGroup, AppGetAll } from "../interfaces";
import { AccessGroup } from "../schemas";

@Route("api/access-group")
@Tags("Efficacy Access Group APIs")
export class AccessGroupController extends Controller {

    @Get()
    @Security("jwt", ["admin", "portal_user"])
    public async getAccessGroups(
        @Queries() queryParams: AppQueryParams
    ): Promise<AppGetAll> {
        return new AccessGroupService().getAll(queryParams);
    }

    @Get("{accessGroupId}")
    @Security("jwt", ["admin", "portal_user"])
    public async getAccessGroup(
        @Path() accessGroupId: string,
    ): Promise<AccessGroup> {
        return new AccessGroupService().get(accessGroupId, 'accessGroupId');
    }

    @SuccessResponse("201", "Created") 
    @Post()
    @Security("jwt", ["admin"])
    public async create(
        @Body() request: CreateAccessGroup
    ): Promise<void> {
        this.setStatus(201)
        await new AccessGroupService().create(request);
        return;
    }

    @SuccessResponse("200", "Updated")
    @Put("{accessGroupId}")
    @Security("jwt", ["admin"])
    public async update(
        @Path() accessGroupId: string,
        @Body() request: UpdateAccessGroup
    ): Promise<void> {
        await new AccessGroupService().update(request, accessGroupId, 'accessGroupId');
        return;
    }

    @SuccessResponse("200", "Updated")
    @Delete("{accessGroupId}")
    @Security("jwt", ["admin"])
    public async delete(
        @Path() accessGroupId: string,
    ): Promise<void> {
        await new AccessGroupService().delete(accessGroupId, 'accessGroupId');
        return;
    }
}