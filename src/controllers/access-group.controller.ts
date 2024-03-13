import { Post, Route, Tags, Get, Put, Delete, Path, Body, Queries, Security } from "tsoa";
import { AccessGroupService } from "../services";
import { AccessGroup } from "../entities";
import { IAccessGroup, IAppQueryParams, IUpdateAccessGroup } from "../interfaces";

@Route("api/access-group")
@Tags("Efficacy Access Group APIs")
export class AccessGroupController {

    @Get()
    @Security("jwt", ["admin", "portal_user"])
    public async getAccessGroups(
        @Queries() queryParams: IAppQueryParams
    ): Promise<AccessGroup[]> {
        return new AccessGroupService().getAccessGroups();
    }

    @Post()
    @Security("jwt", ["admin", "portal_user"])
    public async create(
        @Body() request: IAccessGroup
    ): Promise<AccessGroup> {
        return new AccessGroupService().create(request);
    }

    @Put("{accessGroupId}")
    @Security("jwt", ["admin", "portal_user"])
    public async update(
        @Path() accessGroupId: string,
        @Body() request: IUpdateAccessGroup
    ): Promise<AccessGroup> {
        return new AccessGroupService().update(accessGroupId, request);
    }

    @Delete("{accessGroupId}")
    @Security("jwt", ["admin", "portal_user"])
    public async delete(
        @Path() accessGroupId: string,
    ): Promise<AccessGroup> {
        return new AccessGroupService().delete(accessGroupId);
    }
}