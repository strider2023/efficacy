import { Status } from "../enums";
import { IAuthToken, UpdatePassword } from "../interfaces";
import * as bcrypt from 'bcrypt'
import { ApiError } from "../errors";
import { getDatabaseAdapter } from "../database/knex-config";
import { BaseService } from "./base.service";
import { User } from "../schemas";

export class UserService extends BaseService<User> {

    constructor() {
        super('efficacy.efficacy_user', 'User')
    }

    public async updatePassword(token: IAuthToken, request: UpdatePassword) {
        try {
            const salt = bcrypt.genSaltSync(10);
            const user = await getDatabaseAdapter()
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
}