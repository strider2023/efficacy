import * as dotenv from 'dotenv';
import { Status, UserTypes } from '../enums';
import * as bcrypt from 'bcrypt'
import { getDatabaseAdapter } from '../database/knex-config';

dotenv.config();

const { ADMIN_EMAIL, ADMIN_PASSWORD } =
    process.env;

export async function bootstrapEfficacy() {
    const user = await getDatabaseAdapter()
        .from('efficacy.efficacy_user')
        .where('email', ADMIN_EMAIL)
        .where('status', Status.ACTIVE)
        .first();
    if (!user) {
        const salt = bcrypt.genSaltSync(10);
        const request = {
            firstname: 'Efficacy',
            lastname: 'Admin',
            email: ADMIN_EMAIL,
            password: bcrypt.hashSync(ADMIN_PASSWORD, salt),
            role: UserTypes.ADMIN
        }
        await getDatabaseAdapter()
            .into('efficacy.efficacy_user')
            .insert(request);
    } else {
        console.info("Default user exists");
    }
}