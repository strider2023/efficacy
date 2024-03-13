import { Post, Route, Tags, Get, Put, Delete, Body, Queries, Patch, Request, Security } from "tsoa";
import { UserService } from "../services";
import { User } from "../entities";
import { IAppQueryParams, IAppResponse, IUpdatePassword, IUser } from "../interfaces";

@Route("api/user")
@Tags("Efficacy User APIs")
export class UserController {

    @Get()
    @Security("jwt", ["admin"])
    public async getUsers(
        @Queries() queryParams: IAppQueryParams
    ): Promise<User[]> {
        return new UserService().getUsers(queryParams);
    }

    @Post()
    @Security("jwt", ["admin"])
    public async create(
        @Request() request: any,
        @Body() user: IUser
    ): Promise<User|IAppResponse> {
        return new UserService().create(user, request.user);
    }

    @Put()
    @Security("jwt")
    public async update(
        @Body() request: IUser
    ): Promise<IAppResponse> {
        return new UserService().update(request);
    }

    @Patch("/update-password")
    @Security("jwt")
    public async updatePassword(
        @Request() request: any,
        @Body() password: IUpdatePassword
    ): Promise<IAppResponse> {
        return new UserService().updatePassword(request.user, password);
    }

    @Delete()
    @Security("jwt", ["admin"])
    public async delete(
        @Request() request: any
    ): Promise<IAppResponse> {
        return new UserService().delete(request.user.email);
    }
}