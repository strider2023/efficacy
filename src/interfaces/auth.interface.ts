export interface IAuthentication {
    email: string;
    password: string;
    callbackURL?: string
}

export interface IAuthenticationResponse {
    token: string;
    expiry: Date;
    sessionId: string
    callbackURL?: string
}

export interface IAuthToken {
    firstname: string
    lastname: string
    email: string
    sessionId: string
    role: string
    iat: Date
    exp: Date
    iss: string
}