import { Post, Route, Tags, Body, Patch, Security } from "tsoa";
import { AuthenticationService } from "../services";
import { IAppResponse, IAuthentication, IAuthenticationResponse, IUpdateAccessGroup, IUser } from "../interfaces";

@Route("api/auth")
@Tags("Efficacy Authentication APIs")
export class AuthenticationController {

    @Post("/login")
    public async login(
        @Body() request: IAuthentication
    ): Promise<IAuthenticationResponse|IAppResponse> {
        return new AuthenticationService().authenticate(request);
    }

    @Post("/register")
    public async register(
        @Body() request: IUser
    ): Promise<IAuthenticationResponse|IAppResponse> {
        return new AuthenticationService().registerUser(request);
    }

    @Post("/refresh")
    @Security("jwt")
    public async refreshToken(
        @Body() request: IAuthenticationResponse
    ): Promise<IAuthenticationResponse|IAppResponse> {
        return new AuthenticationService().refreshToken(request);
    }

    @Patch("/logout")
    @Security("jwt")
    public async logout(
        @Body() request: IAuthenticationResponse
    ): Promise<IAppResponse> {
        return new AuthenticationService().logout(request);
    }
}