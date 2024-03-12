import { Post, Route, Tags, Get, Put, Delete, Path, Body, Queries } from "tsoa";
import { AccessGroupService } from "../services";
import { AccessGroup } from "../entities";
import { IAccessGroup, IAppQueryParams, IUpdateAccessGroup } from "../interfaces";

@Route("api/access-group")
@Tags("Efficacy Access Group APIs")
export class AccessGroupController {

    @Get()
    public async getAccessGroups(
        @Queries() queryParams: IAppQueryParams
    ): Promise<AccessGroup[]> {
        return new AccessGroupService().getAccessGroups();
    }

    @Post()
    public async create(
        @Body() request: IAccessGroup
    ): Promise<AccessGroup> {
        return new AccessGroupService().create(request);
    }

    @Put("{accessGroupId}")
    public async update(
        @Path() accessGroupId: string,
        @Body() request: IUpdateAccessGroup
    ): Promise<AccessGroup> {
        return new AccessGroupService().update(accessGroupId, request);
    }

    @Delete("{accessGroupId}")
    public async delete(
        @Path() accessGroupId: string,
    ): Promise<AccessGroup> {
        return new AccessGroupService().delete(accessGroupId);
    }
}