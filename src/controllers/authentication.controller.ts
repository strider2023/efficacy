import { Post, Route, Tags, Body, Patch, Security, Request } from "tsoa";
import { AuthenticationService } from "../services";
import { IAppResponse, IAuthentication, IAuthenticationResponse, IUser } from "../interfaces";
import express from "express";

@Route("api/auth")
@Tags("Efficacy Authentication APIs")
export class AuthenticationController {

    @Post("/login")
    public async login(
        @Body() request: IAuthentication
    ): Promise<IAuthenticationResponse> {
        return new AuthenticationService().authenticate(request);
    }

    @Post("/register")
    public async register(
        @Body() request: IUser
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

    @Patch("/logout")
    @Security("jwt")
    public async logout(
        @Request() request: express.Request,
    ): Promise<IAppResponse> {
        const token = request.headers['authorization'];
        return new AuthenticationService().logout(token);
    }
}