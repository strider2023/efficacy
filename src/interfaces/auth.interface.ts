export interface Authentication {
    email: string;
    password: string;
    callbackURL?: string
}

export interface AuthenticationResponse {
    token: string;
    expiry: Date;
    sessionId: string
    callbackURL?: string
}

export interface RefershPassword {
    token: string;
}

export interface IAuthToken {
    firstname: string
    lastname: string
    email: string
    sessionId: string
    roleId: string
    adminAccess: boolean
    portalAccess: boolean
    appAccess: boolean
    iat: Date
    exp: Date
    iss: string
}