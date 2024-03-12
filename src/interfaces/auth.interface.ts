export interface IAuthentication {
    email: string;
    password: string;
    callbackURL?: string
}

export interface IAuthenticationResponse {
    token: string;
    refreshToken: string;
    callbackURL?: string
}