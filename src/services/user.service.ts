import { Status, UserTypes } from "../enums";
import { User } from "../entities";
import { IAppQueryParams, IAppResponse, IAuthToken, IUpdatePassword, IUser } from "../interfaces";
import * as bcrypt from 'bcrypt'

export class UserService {

    public async getUsers(queryParams: IAppQueryParams): Promise<User[]> {
        const users = await User.find({
            where: {
                status: Status.ACTIVE
            },
            select: {
                firstname: true,
                middlename: true,
                lastname: true,
                phone: true,
                email: true,
                dob: true,
                role: true
            },
        });
        return users;
    }

    public async create(request: IUser, token: IAuthToken): Promise<IAppResponse> {
        const salt = bcrypt.genSaltSync(10);
        const user = new User()
        user.firstname = request.firstname;
        user.middlename = request.middlename;
        user.lastname = request.lastname;
        user.phone = request.phone;
        user.email = request.email;
        user.password = bcrypt.hashSync(request.password, salt);
        user.dob = request.dob;
        user.role = request.role;
        await user.save();
        return  { status: 200, message: "User created." };
    }

    public async update(request: IUser): Promise<IAppResponse> {
        const user = await User.findOneBy({ email: request.email });
        user.firstname = request.firstname;
        user.middlename = request.middlename;
        user.lastname = request.lastname;
        user.phone = request.phone;
        user.dob = request.dob;
        user.role = request.role;
        await user.save();
        return { status: 200, message: "Profile updated successfully." };
    }

    public async updatePassword(token: IAuthToken, request: IUpdatePassword): Promise<IAppResponse> {
        const salt = bcrypt.genSaltSync(10);
        const user = await User.findOneBy({ email: token.email });
        if (!user) {
            return { status: 500, message: "User does not exists." }
        }
        const valid = await bcrypt.compare(request.oldPassword, user.password);
        if (!valid) {
            return { status: 500, message: "Current user password is invalid." }
        }
        user.password = bcrypt.hashSync(request.newPassword, salt);
        await user.save();
        return { status: 200, message: "Password updated successfully." };
    }

    public async delete(email: string): Promise<IAppResponse> {
        const user = await User.findOneBy({ email: email });
        user.status = Status.DELETED;
        await user.save();
        return { status: 200, message: "User deleted successfully." };
    }
}