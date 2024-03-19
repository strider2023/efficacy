import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { Status, UserTypes } from '../enums';
import { IAuthentication, IAuthenticationResponse, CreateUser } from '../interfaces';
import { RedisClient } from '../config/redis-config';
import { AuthError } from '../errors';
import { getDatabaseAdapter } from '../database/knex-config';
import { User } from '../schemas';

dotenv.config();

const { SECRET_KEY, TOKEN_ISSUER } =
    process.env;

export class AuthenticationService {

    tableName = 'efficacy.efficacy_user';

    public async authenticate(request: IAuthentication): Promise<IAuthenticationResponse> {
        const user = await getDatabaseAdapter()
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

    public async registerUser(request: CreateUser): Promise<IAuthenticationResponse> {
        if (request.role == UserTypes.ADMIN || request.role == UserTypes.PORTAL_USER) {
            throw new AuthError("Permission Error", 403, "Only a admin can create an admin or admin portal user account.")
        }
        let user = await getDatabaseAdapter()
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
            user = await getDatabaseAdapter()
                .into(this.tableName)
                .insert(request);
        } catch (e) {
            throw new AuthError("User Registration Error", 500, e.message);
        }
        return this.createSession(user);
    }

    public async refreshToken(request: any, token: string): Promise<IAuthenticationResponse> {
        const userSessionToken = await RedisClient.getInstance().getClient().get(request.sessionId);
        if (userSessionToken != token) {
            throw new AuthError("Authentication Error", 401, "Invalid token.")
        }
        const user = await getDatabaseAdapter()
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
        await RedisClient.getInstance().getClient().del(sessionId);
    }

    private async createSession(user: User, callbackUrl?: string): Promise<IAuthenticationResponse> {
        // Create token
        const tokenBody = {
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            role: user.role,
            sessionId: uuidv4()
        }
        const token = jwt.sign(tokenBody, SECRET_KEY, { expiresIn: '1h', issuer: TOKEN_ISSUER });
        // console.log(token);
        // Create session entry in database
        const expiresIn = new Date();
        expiresIn.setHours(expiresIn.getHours() + 1);
        await RedisClient.getInstance().getClient().set(tokenBody.sessionId, token);
        await RedisClient.getInstance().getClient().expireAt(tokenBody.sessionId, expiresIn);
        return {
            token: token,
            expiry: expiresIn,
            sessionId: tokenBody.sessionId,
            callbackURL: callbackUrl
        }
    }

}