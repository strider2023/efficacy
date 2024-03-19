import { Post, Route, Tags, Body, Patch, Security, Request, Controller, SuccessResponse } from "tsoa";
import { AuthenticationService } from "../services";
import { IAuthentication, IAuthenticationResponse, CreateUser } from "../interfaces";
import express from "express";

@Route("api/auth")
@Tags("Efficacy Authentication APIs")
export class AuthenticationController extends Controller {

    @Post("/login")
    public async login(
        @Body() request: IAuthentication
    ): Promise<IAuthenticationResponse> {
        return new AuthenticationService().authenticate(request);
    }

    @Post("/register")
    public async register(
        @Body() request: CreateUser
    ): Promise<IAuthenticationResponse> {
        return new AuthenticationService().registerUser(request);
    }

    @Post("/refresh")
    @Security("jwt")
    public async refreshToken(
        @Request() exReq: express.Request,
        @Request() request: any,
    ): Promise<IAuthenticationResponse> {
        const token = exReq.headers['authorization'];
        return new AuthenticationService().refreshToken(request.user, token);
    }

    @SuccessResponse("200", "Updated") 
    @Patch("/logout")
    @Security("jwt")
    public async logout(
        @Request() request: express.Request,
    ): Promise<void> {
        const token = request.headers['authorization'];
        new AuthenticationService().logout(token);
        return;
    }
}