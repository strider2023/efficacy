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

export interface IAuthToken {
    firstname: string
    middlename?: string
    lastname: string
    email: string
    image?: string
    role: string
    iat: Date
    exp: Date
    iss: string
}