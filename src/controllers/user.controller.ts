import { Post, Route, Tags, Get, Put, Delete, Body, Queries, Patch, Request, Security, Controller, SuccessResponse } from "tsoa";
import { UserService } from "../services";
import { User } from "../entities";
import { IAppQueryParams, IUpdatePassword, IUser } from "../interfaces";

@Route("api/user")
@Tags("Efficacy User APIs")
export class UserController extends Controller {

    @Get()
    @Security("jwt", ["admin"])
    public async getUsers(
        @Queries() queryParams: IAppQueryParams
    ): Promise<User[]> {
        return new UserService().getUsers(queryParams);
    }

    @SuccessResponse("201", "Created") 
    @Post()
    @Security("jwt", ["admin"])
    public async create(
        @Body() user: IUser
    ): Promise<void> {
        this.setStatus(201)
        await new UserService().create(user);
        return;
    }

    @SuccessResponse("200", "Updated") 
    @Put()
    @Security("jwt")
    public async update(
        @Body() request: IUser
    ): Promise<void> {
        await new UserService().update(request);
        return;
    }

    @SuccessResponse("200", "Updated") 
    @Patch("/update-password")
    @Security("jwt")
    public async updatePassword(
        @Request() request: any,
        @Body() password: IUpdatePassword
    ): Promise<void> {
        await new UserService().updatePassword(request.user, password);
        return;
    }

    @SuccessResponse("200", "Updated") 
    @Delete()
    @Security("jwt", ["admin"])
    public async delete(
        @Request() request: any
    ): Promise<void> {
        await new UserService().delete(request.user.email);
        return;
    }
}