import { Post, Route, Tags, Get, Put, Delete, Body, Queries, Patch, Request, Security, Controller, SuccessResponse } from "tsoa";
import { UserService } from "../services";
import { AppGetAll, AppQueryParams, UpdatePassword, CreateUser, UpdateUser } from "../interfaces";
import * as bcrypt from 'bcrypt'

@Route("api/user")
@Tags("Efficacy User APIs")
export class UserController extends Controller {

    @Get()
    @Security("jwt", ["admin"])
    public async getUsers(
        @Queries() queryParams: AppQueryParams
    ): Promise<AppGetAll> {
        return new UserService().getAll(queryParams);
    }

    @SuccessResponse("201", "Created") 
    @Post()
    @Security("jwt", ["admin"])
    public async create(
        @Body() user: CreateUser
    ): Promise<void> {
        this.setStatus(201);
        const salt = bcrypt.genSaltSync(10);
        user.password = bcrypt.hashSync(user.password, salt);
        await new UserService().create(user);
        return;
    }

    @SuccessResponse("200", "Updated") 
    @Put()
    @Security("jwt")
    public async update(
        @Request() request: any,
        @Body() updateUser: UpdateUser
    ): Promise<void> {
        await new UserService().update(updateUser, request.user.email, 'email');
        return;
    }

    @SuccessResponse("200", "Updated") 
    @Patch("/update-password")
    @Security("jwt")
    public async updatePassword(
        @Request() request: any,
        @Body() password: UpdatePassword
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
        await new UserService().delete(request.user.email, 'email');
        return;
    }
}