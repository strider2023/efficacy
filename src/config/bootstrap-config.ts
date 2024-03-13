import * as dotenv from 'dotenv';
import { Status, UserTypes } from '../enums';
import { User } from '../entities';
import * as bcrypt from 'bcrypt'

dotenv.config();

const { ADMIN_EMAIL, ADMIN_PASSWORD } =
    process.env;

export async function bootstrapEfficacy() {
    let user = await User.findOneBy({
        email: ADMIN_EMAIL,
        status: Status.ACTIVE
    });
    if (!user) {
        const salt = bcrypt.genSaltSync(10);
        user = new User()
        user.firstname = 'Efficacy';
        user.lastname = 'Admin';
        user.email = ADMIN_EMAIL;
        user.password = bcrypt.hashSync(ADMIN_PASSWORD, salt);
        user.role = UserTypes.ADMIN;
        await user.save();
    } else {
        console.info("Default user exists");
    }
}