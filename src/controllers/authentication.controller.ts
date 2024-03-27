import { Post, Route, Tags, Body, Patch, Security, Request, Controller, SuccessResponse } from "tsoa";
import { UserService } from "../services";
import { Authentication, AuthenticationResponse, CreateUser, RefershToken } from "../interfaces";

@Route("api/auth")
@Tags("Efficacy Authentication APIs")
export class AuthenticationController extends Controller {

    @Post("/login")
    public async login(
        @Body() request: Authentication
    ): Promise<AuthenticationResponse> {
        return new UserService().authenticate(request);
    }

    @Post("/register")
    public async register(
        @Body() request: CreateUser
    ): Promise<AuthenticationResponse> {
        return new UserService().registerUser(request);
    }

    @Post("/refresh")
    public async refreshToken(
        @Body() exReq: RefershToken
    ): Promise<AuthenticationResponse> {
        return new UserService().refreshToken(exReq.token);
    }

    @SuccessResponse("200", "Updated") 
    @Patch("/logout")
    @Security("jwt")
    public async logout(
        @Request() request: any,
    ): Promise<void> {
        const token = request.headers['authorization'];
        new UserService().logout(request.user.sessionId, request.user.email);
        return;
    }
}