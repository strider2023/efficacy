import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../entities';
import { Status, UserTypes } from '../enums';
import { IAppResponse, IAuthentication, IAuthenticationResponse, IUser } from '../interfaces';
import { RedisClient } from '../config/redis-config';
import { AuthError } from '../errors';

dotenv.config();

const { SECRET_KEY, TOKEN_ISSUER } =
    process.env;

export class AuthenticationService {

    public async authenticate(request: IAuthentication): Promise<IAuthenticationResponse> {
        const user = await User.findOneBy({
            email: request.email,
            status: Status.ACTIVE
        });
        if (!user) {
            throw new AuthError("Authentication Error", 401, "Invalid user.")
        }
        const valid = await bcrypt.compare(request.password, user.password);
        if (!valid) {
            throw new AuthError("Authentication Error", 401, "Invalid password.")
        }
        return this.createSession(user, request.callbackURL);
    }

    public async registerUser(request: IUser): Promise<IAuthenticationResponse> {
        if (request.role == UserTypes.ADMIN || request.role == UserTypes.PORTAL_USER) {
            throw new AuthError("Permission Error", 403, "Only a admin can create an admin or admin portal user account.")
        }
        let user = await User.findOneBy({
            email: request.email,
            status: Status.ACTIVE
        });
        if (user) {
            throw new AuthError("Permission Error", 403, "User with given email id already exists.")
        }
        try {
            const salt = bcrypt.genSaltSync(10);
            user = new User()
            user.firstname = request.firstname;
            user.middlename = request.middlename;
            user.lastname = request.lastname;
            user.phone = request.phone;
            user.email = request.email;
            user.password = bcrypt.hashSync(request.password, salt);
            user.dob = request.dob;
            user.role = request.role;
            await user.save();
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
        const user = await User.findOneBy({
            email: request.email,
            status: Status.ACTIVE
        });
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