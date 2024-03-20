export interface CreateUser {
    firstname: string
    middlename?: string
    lastname: string
    phone?: string
    email: string
    password: string
    roleId: string
    dob?: Date
    image?: string
    location?: string
    description?: string
    tags?: string[]
    additionalMetadata?: Record<string, any>
}

export interface UpdateUser {
    firstname: string
    middlename?: string
    lastname: string
    phone?: string
    roleId: string
    dob?: Date
    image?: string
    location?: string
    description?: string
    tags?: string[]
    additionalMetadata?: Record<string, any>
}

export interface UpdatePassword {
    oldPassword: string;
    newPassword: string;
}

export interface UserSession {
    sessionId: string;
    token: string;
    expiry: Date;
}
