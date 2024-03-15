import { Status, UserTypes } from "../enums";
import { User } from "../entities";
import { IAppQueryParams, IAppResponse, IAuthToken, IUpdatePassword, IUser } from "../interfaces";
import * as bcrypt from 'bcrypt'
import { ApiError } from "../errors";

export class UserService {

    public async getUsers(queryParams: IAppQueryParams): Promise<User[]> {
        const users = await User.find({
            where: {
                status: Status.ACTIVE
            },
            select: {
                id: true,
                firstname: true,
                middlename: true,
                lastname: true,
                phone: true,
                email: true,
                dob: true,
                role: true,
                status: true,
            },
        });
        return users;
    }

    public async create(request: IUser) {
        const salt = bcrypt.genSaltSync(10);
        try {
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
        } catch (e) {
            throw new ApiError("Create User Error", 500, e.message);
        }
    }

    public async update(request: IUser) {
        const user = await User.findOneBy({ email: request.email });
        if (!user) {
            throw new ApiError("Update User Error", 500, "User does not exists.");
        }
        user.firstname = request.firstname;
        user.middlename = request.middlename;
        user.lastname = request.lastname;
        user.phone = request.phone;
        user.dob = request.dob;
        user.role = request.role;
        await user.save();
    }

    public async updatePassword(token: IAuthToken, request: IUpdatePassword) {
        const salt = bcrypt.genSaltSync(10);
        const user = await User.findOneBy({ email: token.email });
        if (!user) {
            throw new ApiError("Update Password Error", 500, "User does not exists.")
        }
        const valid = await bcrypt.compare(request.oldPassword, user.password);
        if (!valid) {
            throw new ApiError("Update Password Error", 500, "Current user password is invalid.")
        }
        user.password = bcrypt.hashSync(request.newPassword, salt);
        await user.save();
    }

    public async delete(email: string) {
        const user = await User.findOneBy({ email: email });
        user.status = Status.DELETED;
        await user.save();
    }
}