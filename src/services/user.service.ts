import { Status, UserTypes } from "../enums";
import { CreateUser, IAuthToken, Authentication, AuthenticationResponse, UpdatePassword } from "../interfaces";
import { ApiError, AuthError } from "../errors";
import { BaseService } from "./base.service";
import { User } from "../schemas";
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { TABLE_ROLES, TABLE_USERS } from "../constants/tables.constants";

dotenv.config();

const { SECRET_KEY, TOKEN_ISSUER } =
    process.env;

export class UserService extends BaseService<User> {

    constructor() {
        super(TABLE_USERS, 'User')
    }

    public async registerUser(request: CreateUser): Promise<AuthenticationResponse> {
        let user = await this.db
            .from(this.tableName)
            .where('email', request.email)
            .where('status', Status.ACTIVE)
            .first();
        if (user) {
            throw new AuthError("Permission Error", 403, "User with given email id already exists.")
        }
        try {
            const salt = bcrypt.genSaltSync(10);
            request.password = bcrypt.hashSync(request.password, salt);
            user = await this.db
                .into(this.tableName)
                .insert(request);
        } catch (e) {
            throw new AuthError("User Registration Error", 500, e.message);
        }
        return this.createSession(user);
    }

    public async updatePassword(token: IAuthToken, request: UpdatePassword) {
        try {
            const salt = bcrypt.genSaltSync(10);
            const user = await this.db
                .from(this.tableName)
                .where('email', token.email)
                .where('status', Status.ACTIVE)
                .first();
            if (!user) {
                throw new ApiError("Update Password Error", 500, "User does not exists.")
            }
            const valid = await bcrypt.compare(request.oldPassword, user.password);
            if (!valid) {
                throw new ApiError("Update Password Error", 500, "Current user password is invalid.")
            }
            user.update({
                password: bcrypt.hashSync(request.newPassword, salt)
            })
        } catch (e) {
            throw new ApiError("Update User Error", 500, e.message)
        }
    }

    public async authenticate(request: Authentication): Promise<AuthenticationResponse> {
        const user = await this.db
            .from(this.tableName)
            .where('email', request.email)
            .where('status', Status.ACTIVE)
            .first();
        // console.log(user);
        if (!user) {
            throw new AuthError("Authentication Error", 401, "Invalid user.")
        }
        const valid = await bcrypt.compare(request.password, user.password);
        if (!valid) {
            throw new AuthError("Authentication Error", 401, "Invalid password.")
        }
        return this.createSession(user, request.callbackURL);
    }

    public async refreshToken(request: any, token: string): Promise<AuthenticationResponse> {
        const userSessionToken = await this.cache.get(request.sessionId);
        if (userSessionToken != token) {
            throw new AuthError("Authentication Error", 401, "Invalid token.")
        }
        const user = await this.db
            .from(this.tableName)
            .where('email', request.email)
            .where('status', Status.ACTIVE)
            .first();
        if (!user) {
            throw new AuthError("Authentication Error", 401, "Invalid user.")
        }
        return this.createSession(user);
    }

    public async logout(sessionId: string) {
        await this.cache.del(sessionId);
    }

    ////////////////////////////// Private Functions ////////////////////////////
    private async getRole(role: string) {
        const collection = await this.db
            .from(TABLE_ROLES)
            .where('id', role)
            .first();
        return collection;
    }

    private async createSession(user: User, callbackUrl?: string): Promise<AuthenticationResponse> {
        const role = await this.db
            .from(TABLE_ROLES)
            .where('id', user.roleId)
            .first();
        // Create token
        const tokenBody = {
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            roleId: user.roleId,
            adminAccess: role.adminAccess,
            portalAccess: role.portalAccess,
            appAccess: role.appAccess,
            sessionId: uuidv4()
        }
        const token = jwt.sign(tokenBody, SECRET_KEY, { expiresIn: '1h', issuer: TOKEN_ISSUER });
        // console.log(token);
        // Create session entry in database
        const expiresIn = new Date();
        expiresIn.setHours(expiresIn.getHours() + 1);
        await this.cache.set(tokenBody.sessionId, token);
        await this.cache.expireAt(tokenBody.sessionId, expiresIn);
        return {
            token: token,
            expiry: expiresIn,
            sessionId: tokenBody.sessionId,
            callbackURL: callbackUrl
        }
    }
}