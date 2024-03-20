import { Post, Route, Tags, Get, Put, Delete, Path, Body, Queries, Security, Controller, SuccessResponse } from "tsoa";
import { RolesService } from "../services";
import { CreateRole, AppQueryParams, UpdateRole, AppGetAll } from "../interfaces";
import { Roles } from "../schemas";

@Route("api/roles")
@Tags("Efficacy Roles APIs")
export class RolesController extends Controller {

    @Get()
    @Security("jwt")
    public async getAccessGroups(
        @Queries() queryParams: AppQueryParams
    ): Promise<AppGetAll> {
        return new RolesService().getAll(queryParams);
    }

    @Get("{accessGroupId}")
    @Security("jwt")
    public async getAccessGroup(
        @Path() accessGroupId: string,
    ): Promise<Roles> {
        return new RolesService().get(accessGroupId, 'accessGroupId');
    }

    @SuccessResponse("201", "Created")
    @Post()
    @Security("jwt")
    public async create(
        @Body() request: CreateRole
    ): Promise<void> {
        this.setStatus(201)
        await new RolesService().create(request);
        return;
    }

    @SuccessResponse("200", "Updated")
    @Put("{accessGroupId}")
    @Security("jwt")
    public async update(
        @Path() accessGroupId: string,
        @Body() request: UpdateRole
    ): Promise<void> {
        await new RolesService().update(request, accessGroupId, 'accessGroupId');
        return;
    }

    @SuccessResponse("200", "Updated")
    @Delete("{accessGroupId}")
    @Security("jwt")
    public async delete(
        @Path() accessGroupId: string,
    ): Promise<void> {
        await new RolesService().delete(accessGroupId, 'accessGroupId');
        return;
    }
}