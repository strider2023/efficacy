import { Post, Route, Tags, Get, Put, Delete, Path, Body, Queries } from "tsoa";
import { UserService } from "../services";
import { User } from "../entities";
import { IAppQueryParams, IUser } from "../interfaces";

@Route("api/user")
@Tags("Efficacy User APIs")
export class UserController {

    @Get()
    public async getUsers(
        @Queries() queryParams: IAppQueryParams
    ): Promise<User[]> {
        return new UserService().getUsers(queryParams);
    }

    @Post()
    public async create(
        @Body() request: IUser
    ): Promise<User> {
        return new UserService().create(request);
    }

    @Put()
    public async update(
        @Body() request: IUser
    ): Promise<User> {
        return new UserService().update(request);
    }

    @Delete("{userId}")
    public async delete(
        @Path() userId: string,
    ): Promise<User> {
        return new UserService().delete(userId);
    }
}