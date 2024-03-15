import { Post, Route, Tags, Get, Put, Delete, Path, Body, Queries, Security, Controller, SuccessResponse } from "tsoa";
import { AccessGroupService } from "../services";
import { AccessGroup } from "../entities";
import { IAccessGroup, IAppQueryParams, IUpdateAccessGroup } from "../interfaces";

@Route("api/access-group")
@Tags("Efficacy Access Group APIs")
export class AccessGroupController extends Controller {

    @Get()
    @Security("jwt", ["admin", "portal_user"])
    public async getAccessGroups(
        @Queries() queryParams: IAppQueryParams
    ): Promise<AccessGroup[]> {
        return new AccessGroupService().getAccessGroups();
    }

    @SuccessResponse("201", "Created") 
    @Post()
    @Security("jwt", ["admin", "portal_user"])
    public async create(
        @Body() request: IAccessGroup
    ): Promise<void> {
        this.setStatus(201)
        await new AccessGroupService().create(request);
        return;
    }

    @SuccessResponse("200", "Updated")
    @Put("{accessGroupId}")
    @Security("jwt", ["admin", "portal_user"])
    public async update(
        @Path() accessGroupId: string,
        @Body() request: IUpdateAccessGroup
    ): Promise<void> {
        await new AccessGroupService().update(accessGroupId, request);
        return;
    }

    @SuccessResponse("200", "Updated")
    @Delete("{accessGroupId}")
    @Security("jwt", ["admin", "portal_user"])
    public async delete(
        @Path() accessGroupId: string,
    ): Promise<void> {
        await new AccessGroupService().delete(accessGroupId);
        return;
    }
}