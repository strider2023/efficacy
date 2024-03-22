import { JSONSchemaType } from "ajv";

export interface Authentication {
    email: string;
    password: string;
    callbackURL?: string
}

export const AuthenticationSchema = {
    type: "object",
    properties: {
        email: { type: "email" },
        password: { type: "string" },
        callbackURL: { type: "string", nullable: true },
    },
    required: ["email", "password"],
    additionalProperties: false
}

export interface AuthenticationResponse {
    token: string;
    expiry: Date;
    sessionId: string
    callbackURL?: string
}

export interface RefershToken {
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