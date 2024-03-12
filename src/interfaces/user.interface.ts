export interface IUser {
    firstname: string;
    middlename: string;
    lastname: string;
    phone: string;
    email: string;
    password: string;
    dob?: Date;
    role?: string
}