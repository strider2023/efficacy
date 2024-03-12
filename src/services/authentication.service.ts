import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';
import { User, UserSession } from '../entities';
import { Status } from '../enums';
import { IAppResponse, IAuthentication, IAuthenticationResponse } from '../interfaces';
import { LessThan } from 'typeorm';

dotenv.config();

const { SECRET_KEY, TOKEN_ISSUER } =
    process.env;

export class AuthenticationService {

    public async authenticate(request: IAuthentication): Promise<IAuthenticationResponse | IAppResponse> {
        const errorResponse: IAppResponse = {
            status: 500,
            message: "Invalid login credentials"
        };
        const user = await User.findOneBy({
            email: request.email,
            status: Status.ACTIVE
        });
        if (!user) {
            return errorResponse;
        }
        const valid = await bcrypt.compare(request.password, user.password);
        if (!valid) {
            return errorResponse;
        }
        // Create token
        const token = jwt.sign({
            firstname: user.firstname,
            middlename: user.middlename || '',
            lastname: user.lastname,
            email: request.email,
            image: user.image || '',
            role: user.role
        }, SECRET_KEY, { expiresIn: '1h', issuer: TOKEN_ISSUER });
        console.log(token);
        // Remove old sessions that have expired
        await UserSession.delete({
            expiry: LessThan(new Date())
        });
        // Create session entry in database
        // TODO: Move it to in memory
        const expiresIn = new Date();
        expiresIn.setHours(expiresIn.getHours() + 1);
        const userSession = new UserSession();
        userSession.token = token;
        userSession.expiry = expiresIn;
        await userSession.save()
        const response: IAuthenticationResponse = {
            token: userSession.token,
            refreshToken: userSession.refreshToken,
            callbackURL: request.callbackURL
        }
        return response;
    }

    public async refreshToken(request: IAuthenticationResponse): Promise<IAuthenticationResponse | IAppResponse> {
        const errorResponse: IAppResponse = {
            status: 500,
            message: "Invalid login credentials"
        };
        return errorResponse;
    }

    public async logout(request: IAuthenticationResponse): Promise<IAppResponse> {
        const errorResponse: IAppResponse = {
            status: 500,
            message: "Invalid login credentials"
        };
        return errorResponse;
    }

}