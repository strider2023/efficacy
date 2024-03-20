import { Post, Route, Tags, Get, Put, Delete, Path, Body, Queries, Security, Controller, SuccessResponse } from "tsoa";
import { RolesService } from "../services";
import { CreateRole, AppQueryParams, UpdateRole, AppGetAll } from "../interfaces";
import { Roles } from "../schemas";

@Route("api/roles")
@Tags("Efficacy Roles APIs")
export class RolesController extends Controller {

    @Get()
    @Security("jwt")
    public async getAll(
        @Queries() queryParams: AppQueryParams
    ): Promise<AppGetAll> {
        return new RolesService().getAll(queryParams);
    }

    @Get("{rolesId}")
    @Security("jwt")
    public async get(
        @Path() rolesId: string,
    ): Promise<Roles> {
        return new RolesService().get(rolesId, 'rolesId');
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
    @Put("{rolesId}")
    @Security("jwt")
    public async update(
        @Path() rolesId: string,
        @Body() request: UpdateRole
    ): Promise<void> {
        await new RolesService().update(request, rolesId, 'rolesId');
        return;
    }

    @SuccessResponse("200", "Updated")
    @Delete("{rolesId}")
    @Security("jwt")
    public async delete(
        @Path() rolesId: string,
    ): Promise<void> {
        await new RolesService().delete(rolesId, 'rolesId');
        return;
    }
}