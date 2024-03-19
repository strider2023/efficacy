export interface CreateUser {
    firstname: string;
    middlename?: string;
    lastname: string;
    phone?: string;
    email: string;
    password: string;
    dob?: Date;
    role: string
}

export interface UpdateUser {
    firstname: string;
    middlename?: string;
    lastname: string;
    phone?: string;
    dob?: Date;
}

export interface UpdatePassword {
    oldPassword: string;
    newPassword: string;
}

export interface IUserSession {
    sessionId: string;
    token: string;
    expiry: Date;
}
