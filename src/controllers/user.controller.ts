import { Post, Route, Tags, Get, Put, Delete, Body, Queries, Patch, Request, Security, Controller, SuccessResponse } from "tsoa";
import { UserService } from "../services";
import { AppGetAll, AppQueryParams, UpdatePassword, CreateUser, UpdateUser } from "../interfaces";
import * as bcrypt from 'bcrypt'
import { ApiError } from "../errors";
import { Status } from "../enums";

@Route("api/user")
@Tags("Efficacy User APIs")
export class UserController extends Controller {

    @Get()
    @Security("jwt")
    public async getUsers(
        @Queries() queryParams: AppQueryParams
    ): Promise<AppGetAll> {
        queryParams.properties = ['firstname', 'middlename', 'lastname', 'phone', 'email'];
        return new UserService().getAll(queryParams, Status.ACTIVE);
    }

    @SuccessResponse("201", "Created") 
    @Post()
    @Security("jwt")
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
        if (request.user.adminAccess && updateUser.email) {
            await new UserService().update(updateUser, updateUser.email, 'email');
        } else if (request.user.email == updateUser.email) {
            await new UserService().update(updateUser, request.user.email, 'email');
        } else {
            throw new ApiError("Invalid Request", 500, "You cannot perform this action.");
        }
        console.log(request.user.adminAccess, updateUser.email)
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
    @Security("jwt")
    public async delete(
        @Request() request: any
    ): Promise<void> {
        await new UserService().delete(request.user.email, 'email');
        return;
    }
}