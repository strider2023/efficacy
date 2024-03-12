import { Post, Route, Tags, Body, Patch } from "tsoa";
import { AuthenticationService } from "../services";
import { IAppResponse, IAuthentication, IAuthenticationResponse, IUpdateAccessGroup } from "../interfaces";

@Route("api/auth")
@Tags("Efficacy Authentication APIs")
export class AuthenticationController {

    @Post("/login")
    public async login(
        @Body() request: IAuthentication
    ): Promise<IAuthenticationResponse|IAppResponse> {
        return new AuthenticationService().authenticate(request);
    }

    @Post("/refresh")
    public async refreshToken(
        @Body() request: IAuthenticationResponse
    ): Promise<IAuthenticationResponse|IAppResponse> {
        return new AuthenticationService().refreshToken(request);
    }

    @Patch("/logout")
    public async logout(
        @Body() request: IAuthenticationResponse
    ): Promise<IAppResponse> {
        return new AuthenticationService().logout(request);
    }
}