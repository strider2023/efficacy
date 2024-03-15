export interface IUser {
    firstname: string;
    middlename?: string;
    lastname: string;
    phone?: string;
    email: string;
    password: string;
    dob?: Date;
    role?: string
}

export interface IUserSession {
    sessionId: string;
    token: string;
    expiry: Date;
}

export interface IUpdatePassword {
    oldPassword: string;
    newPassword: string;
}