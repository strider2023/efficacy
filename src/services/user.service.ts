import { Status } from "../enums/enums";
import { User } from "../entities";
import { IAppQueryParams, IUser } from "../interfaces";
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

    public async create(request: IUser): Promise<User> {
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
        return user;
    }

    public async update(request: IUser): Promise<User> {
        const user = await User.findOneBy({ email: request.email });
        user.firstname = request.firstname;
        user.middlename = request.middlename;
        user.lastname = request.lastname;
        user.phone = request.phone;
        user.dob = request.dob;
        user.role = request.role;
        await user.save();
        return user;
    }

    public async updatePassword(email: string, password: string): Promise<User> {
        const salt = bcrypt.genSaltSync(10);
        const user = await User.findOneBy({ email: email });
        user.password = bcrypt.hashSync(password, salt);
        await user.save();
        return user;
    }

    public async delete(email: string): Promise<User> {
        const user = await User.findOneBy({ email: email });
        user.status = Status.DELETED;
        await user.save();
        return user;
    }
}