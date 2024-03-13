import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';
import { User, UserSession } from '../entities';
import { Status, UserTypes } from '../enums';
import { IAppResponse, IAuthentication, IAuthenticationResponse, IUser } from '../interfaces';
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
        // console.log(token);
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

    public async registerUser(request: IUser): Promise<IAuthenticationResponse | IAppResponse> {
        let errorResponse: IAppResponse = {
            status: 500,
            message: ""
        };
        if (request.role == UserTypes.ADMIN || request.role == UserTypes.PORTAL_USER) {
            errorResponse.message = "Only a admin can create an admin or admin portal user account."
            return errorResponse;
        }
        let user = await User.findOneBy({
            email: request.email,
            status: Status.ACTIVE
        });
        if (user) {
            errorResponse.message = "User with given email id already exists."
            return errorResponse;
        }
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
        const token = jwt.sign({
            firstname: user.firstname,
            middlename: user.middlename || '',
            lastname: user.lastname,
            email: request.email,
            image: user.image || '',
            role: user.role
        }, SECRET_KEY, { expiresIn: '1h', issuer: TOKEN_ISSUER });
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
            refreshToken: userSession.refreshToken
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